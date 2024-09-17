import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { captchaDialogService } from 'src/app/api-service/captchaDialog.service';
import { RawMatPurchaseReportsService } from 'src/app/api-service/rawmatPurchase-reports/rawMatPurchase-reports.service';
import { SupplierMasterService } from 'src/app/api-service/supplierMaster.service';

@Component({
  selector: 'app-supplier-payment',
  standalone: false,
  templateUrl: './supplier-payment.component.html',
  styleUrl: './supplier-payment.component.scss',
  providers: [DatePipe]
})
export class SupplierPaymentComponent {
  supplierDetailsList: any[] = [];
  supplierPayment: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];

  constructor(private RMPRSVC: RawMatPurchaseReportsService,
    private sMSvc: SupplierMasterService,
    private notificationSvc: NotificationsService,
    private capDialog: captchaDialogService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.getSupplierList();
  }

  reportForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    supplierid: new FormControl(null),
    ischq: new FormControl(false)
  });

  async getReport() {
    if (this.reportForm.valid) {
      const fromDate = this.reportForm.value.fromdate;
      const toDate = this.reportForm.value.todate;
      const SupID = this.reportForm.value.supplierid;
      let res = await this.RMPRSVC.getPayment(fromDate, toDate, SupID, this.companyID).toPromise();
      this.supplierPayment = res || [];
    }
    else {
      this.notificationSvc.error('Please enter the required fields !');
    }
  }

  getSupplierList() {
    this.sMSvc.getList(this.companyID).subscribe((res: any) => {
      this.supplierDetailsList = res;
      this.suggestions = res;
    });
  }

  suggest(value: any) {
    this.suggestions = this.supplierDetailsList.filter((item) =>
      item.supplier_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1) this.suggestions = this.supplierDetailsList;
  }

  getChequeAmount() {
    let c_amount = 0;
    c_amount = this.supplierPayment.reduce((acc: any, item: any) => (acc += Number(item.c_amount)), 0);
    return c_amount;
  }

  paidTot() {
    let deduction_amount = 0;
    deduction_amount = this.supplierPayment.reduce((acc: any, item: any) => (acc += Number(item.deduction_amount)), 0);
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
          this.RMPRSVC.delete(id).subscribe((res) => {
            if (res?.status == 'Deleted successfully') {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  cancelClick() {
    this.supplierPayment = [];
    this.getReport();
  }
}
