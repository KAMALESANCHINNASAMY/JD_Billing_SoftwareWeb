import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { captchaDialogService } from 'src/app/api-service/captchaDialog.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { customerPaymentService } from 'src/app/api-service/payment/customerPayment.service';

@Component({
  selector: 'app-customer-payment',
  standalone: false,
  templateUrl: './customer-payment.component.html',
  styleUrl: './customer-payment.component.scss',
  providers: [DatePipe]
})
export class CustomerPaymentComponent {
  customerDetailsList: any[] = [];
  gstSuggestions: any[] = [];
  NonGSTSuggestions: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  PaymentReports: any[] = [];
  constructor(
    private cMSvc: customerMasterService,
    private notificationSvc: NotificationsService,
    private cpSvc: customerPaymentService,
    private datePipe: DatePipe,
    private capDialog: captchaDialogService
  ) { }

  ngOnInit() {
    this.getCustomerList();
  }

  getCustomerList() {
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.customerDetailsList = res;
      this.gstSuggestions = res;
      this.NonGSTSuggestions = res;
    });
  }

  gstSuggest(value: any) {
    this.gstSuggestions = this.customerDetailsList.filter((item) =>
      item.customer_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.gstSuggestions.length < 1)
      this.gstSuggestions = this.customerDetailsList;
  }

  reportForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    customerid: new FormControl(null),
    ischq: new FormControl(false)
  });

  async getSalesPaymentReports() {
    if (this.reportForm.valid) {
      const fromDate = this.reportForm.value.fromdate;
      const toDate = this.reportForm.value.todate;
      const cusId = this.reportForm.value.customerid;     
      let res = await this.cpSvc.getPayment(fromDate, toDate, cusId, this.companyID).toPromise();
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
          this.cpSvc.delete(id).subscribe((res) => {
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
