import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { SalesReportService } from 'src/app/api-service/sales-reports/sales-report.service';

@Component({
  selector: 'app-sales-nongst-payment-reports',
  templateUrl: './sales-nongst-payment-reports.component.html',
  styleUrl: './sales-nongst-payment-reports.component.scss'
})
export class SalesNongstPaymentReportsComponent implements OnInit {
  customerDetailsList: any[] = [];
  PaymentReports: any[] = [];
  PaymentReportsAll: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];
  constructor(private SLSRSVC: SalesReportService,
    private cMSvc: customerMasterService,
    private notificationSvc: NotificationsService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.getCustomerList();
  }

  getCustomerList() {
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.customerDetailsList = res;
      this.suggestions = res;
    });
  }
  suggest(value: any) {
    this.suggestions = this.customerDetailsList.filter((item) =>
      item.customer_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.customerDetailsList;
  }

  reportForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    customerid: new FormControl(null),
    ischeck: new FormControl(false)
  });

  async getSalesPaymentReports() {
    if (this.reportForm.valid) {
      const fromDate = this.reportForm.value.fromdate;
      const toDate = this.reportForm.value.todate;
      const cusId = this.reportForm.value.customerid;
      let res = await this.SLSRSVC.getSalesBillingPaymentsNonGstFromToDate(fromDate, toDate, cusId, this.companyID).toPromise();
      this.PaymentReportsAll = res || [];
      this.PaymentReports = res || [];

      if (this.reportForm.value.ischeck) {
        this.PaymentReports = this.PaymentReportsAll.filter((e) => { return Number(e.deduction_amount) > 0 });
      }
      else {
        this.PaymentReports = this.PaymentReportsAll;
      }
    }
    else {
      this.notificationSvc.error('Please enter the required fields !');
    }
  }

  filtervaildAmount(event: any) {
    if (event.target.checked) {
      this.PaymentReports = this.PaymentReportsAll.filter((e) => { return Number(e.deduction_amount) > 0 });
    }
    else {
      this.PaymentReports = this.PaymentReportsAll;
    }
  }

  total_amount() {
    let total_amount = 0;
    total_amount = this.PaymentReports.reduce(
      (acc: any, item: any) => (acc += Number(item.total_amount)),
      0
    );
    return total_amount;
  }

  deduction_amount() {
    let deduction_amount = 0;
    deduction_amount = this.PaymentReports.reduce(
      (acc: any, item: any) => (acc += Number(item.deduction_amount)),
      0
    );
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
}
