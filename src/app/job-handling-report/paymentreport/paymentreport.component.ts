import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { captchaDialogService } from 'src/app/api-service/captchaDialog.service';
import { purchaseFromThirdPartyPaymentService } from 'src/app/api-service/payment/purchaseFromThirdPartyPayment.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';

@Component({
  selector: 'app-paymentreport',
  templateUrl: './paymentreport.component.html',
  styleUrl: './paymentreport.component.scss',
  providers: [DatePipe]
})
export class PaymentreportComponent {
  thirdPartyPayment: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  suggestions: any[] = [];

  constructor(
    private tHMSVC: thirdPartyMasterService,
    private capDialog: captchaDialogService,
    private datePipe: DatePipe,
    private sMPSvc: purchaseFromThirdPartyPaymentService,
    private notificationSvc: NotificationsService,
  ) { }

  ngOnInit() {
    this.getThirdPartyList();
  }

  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.suggestions = res;
    });
  }

  suggest(value: any) {
    this.suggestions = this.thirdPartyDetailsList.filter(item =>
      item.party_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1) this.suggestions = this.thirdPartyDetailsList
  }

  reportForm = new FormGroup({
    third_partyid: new FormControl(null),
    fromdate: new FormControl(''),
    todate: new FormControl('')
  })

  async getReport() {
    if (this.reportForm.valid) {
      const fromDate = this.reportForm.value.fromdate;
      const toDate = this.reportForm.value.todate;
      const SupID = this.reportForm.value.third_partyid;
      let res = await this.sMPSvc.getPayment(fromDate, toDate, SupID, this.companyID).toPromise();
      this.thirdPartyPayment = res || [];
    }
    else {
      this.notificationSvc.error('Please enter the required fields !');
    }
  }

  getFormattedDate(dateString: string): string | null {
    if (dateString) {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'dd-MM-yyyy');
    } else {
      return '';
    }
  }

  cancelClick() {
    this.thirdPartyPayment = [];
    this.getReport();
  }

  deleteClick(id: number) {
    this.capDialog.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.sMPSvc.delete(id).subscribe((res) => {
            if (res?.status == 'Deleted successfully') {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }
}
