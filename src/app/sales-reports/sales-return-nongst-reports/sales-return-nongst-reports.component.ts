import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { SalesReportService } from 'src/app/api-service/sales-reports/sales-report.service';

@Component({
  selector: 'app-sales-return-nongst-reports',
  templateUrl: './sales-return-nongst-reports.component.html',
  styleUrl: './sales-return-nongst-reports.component.scss'
})
export class SalesReturnNongstReportsComponent implements OnInit {
  customerDetailsList: any[] = [];
  returnReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];

  ngOnInit() { this.getCustomerList(); }

  constructor(private SLSRSVC: SalesReportService,
    private cMSvc: customerMasterService,
    private notificationSvc: NotificationsService,
    private datePipe: DatePipe) { }

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
    customerid: new FormControl(null)
  });

  getSalesReturnReports() {
    if (this.reportForm.valid) {
      const fromDate = this.reportForm.value.fromdate;
      const toDate = this.reportForm.value.todate;
      const cusId = this.reportForm.value.customerid;
      this.SLSRSVC.getSalesBillingReturnNongstFromToDate(fromDate, toDate, cusId, this.companyID).subscribe((res) => {
        this.returnReports = res;
      });
    }
    else {
      this.notificationSvc.error('Please enter the required fields !')
    }
  }

  totalQty() {
    let return_qty = 0;
    return_qty = this.returnReports.reduce(
      (acc: any, item: any) => (acc += Number(item.return_qty)),
      0
    );
    return return_qty;
  }

  totalnet_total() {
    let return_total = 0;
    return_total = this.returnReports.reduce(
      (acc: any, item: any) => (acc += Number(item.return_total)),
      0
    );
    return return_total;
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
