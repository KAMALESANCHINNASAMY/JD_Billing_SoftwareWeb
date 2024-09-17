import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { captchaDialogService } from 'src/app/api-service/captchaDialog.service';
import { thirdPartyPaymentService } from 'src/app/api-service/payment/thirdpartyPayment.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';

@Component({
  selector: 'app-third-party-payment',
  standalone: false,
  templateUrl: './third-party-payment.component.html',
  styleUrl: './third-party-payment.component.scss',
  providers: [DatePipe]
})
export class ThirdPartyPaymentComponent {
  thirdPartyDetailsList: any[] = [];
  gstSuggestions: any[] = [];
  NonGSTSuggestions: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  PaymentReports: any[] = [];
  constructor(
    private tHMSVC: thirdPartyMasterService,
    private notificationSvc: NotificationsService,
    private TPPSVC: thirdPartyPaymentService,
    private datePipe: DatePipe,
    private capDialog: captchaDialogService
  ) { }

  ngOnInit() {
    this.getThirdPartyList();
  }

  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.gstSuggestions = res;
    });
  }


  gstSuggest(value: any) {
    this.gstSuggestions = this.thirdPartyDetailsList.filter((item) =>
      item.party_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.gstSuggestions.length < 1)
      this.gstSuggestions = this.thirdPartyDetailsList;
  }

  reportForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    third_partyid: new FormControl(null),
    ischq: new FormControl(false)
  });

  async getSalesPaymentReports() {
    if (this.reportForm.valid) {
      const fromDate = this.reportForm.value.fromdate;
      const toDate = this.reportForm.value.todate;
      const tpId = this.reportForm.value.third_partyid;
      let res = await this.TPPSVC.getPayment(fromDate, toDate, tpId, this.companyID).toPromise();
      this.PaymentReports = res || [];
    }
    else {
      this.notificationSvc.error('Please enter the required fields !');
    }
  }

  totalChequeAmount() {
    let c_amount = 0;
    c_amount = this.PaymentReports.reduce((acc: any, item: any) => (acc += Number(item.c_amount)), 0);
    return c_amount;
  }

  deduction_amount() {
    let deduction_amount = 0;
    deduction_amount = this.PaymentReports.reduce((acc: any, item: any) => (acc += Number(item.deduction_amount)), 0);
    return deduction_amount;
  }

  getFormattedDate(dateString: string): string | null {
    if (dateString) {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'dd-MM-yyyy');
    } else {
      return '';
    }
  }

  deleteClick(id: number) {
    this.capDialog.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.TPPSVC.delete(id).subscribe((res) => {
            if (res?.status == 'Deleted successfully') {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  cancelClick() {
    this.PaymentReports = [];
    this.getSalesPaymentReports();
  }
}
