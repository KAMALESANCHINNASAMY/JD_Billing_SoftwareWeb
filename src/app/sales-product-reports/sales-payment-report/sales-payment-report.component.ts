import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { captchaDialogService } from 'src/app/api-service/captchaDialog.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { salesProductReportService } from 'src/app/api-service/salesProductReport.service';

@Component({
  selector: 'app-sales-payment-report',
  templateUrl: './sales-payment-report.component.html',
  styleUrl: './sales-payment-report.component.scss'
})
export class SalesPaymentReportComponent {
  customerDetailsList: any[] = [];
  customerPayment: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];

  constructor(private RMPRSVC: salesProductReportService,
    private cMSvc: customerMasterService,
    private notificationSvc: NotificationsService,
    private capDialog: captchaDialogService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.getCustomerList();
  }

  reportForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    customerid: new FormControl(null),
    ischq: new FormControl(false)
  });

  async getReport() {
    if (this.reportForm.valid) {
      const fromDate = this.reportForm.value.fromdate;
      const toDate = this.reportForm.value.todate;
      const SupID = this.reportForm.value.customerid;
      let res = await this.RMPRSVC.getPayment(fromDate, toDate, SupID, this.companyID).toPromise();
      this.customerPayment = res || [];
    }
    else {
      this.notificationSvc.error('Please enter the required fields !');
    }
  }

  getCustomerList() {
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.customerDetailsList = res;
      this.suggestions = res;
    });
  }

  gstSuggest(value: any) {
    this.suggestions = this.customerDetailsList.filter((item) =>
      item.customer_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.customerDetailsList;
  }

  getChequeAmount() {
    let c_amount = 0;
    c_amount = this.customerPayment.reduce((acc: any, item: any) => (acc += Number(item.c_amount)), 0);
    return c_amount;
  }

  paidTot() {
    let deduction_amount = 0;
    deduction_amount = this.customerPayment.reduce((acc: any, item: any) => (acc += Number(item.deduction_amount)), 0);
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
    this.customerPayment = [];
    this.getReport();
  }
}
