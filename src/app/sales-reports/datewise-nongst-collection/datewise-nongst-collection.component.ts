import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { SalesReportService } from 'src/app/api-service/sales-reports/sales-report.service';

@Component({
  selector: 'app-datewise-nongst-collection',
  templateUrl: './datewise-nongst-collection.component.html',
  styleUrl: './datewise-nongst-collection.component.scss',
  providers: [DatePipe]
})
export class DatewiseNongstCollectionComponent implements OnInit {
  customerDetailsList: any[] = [];
  salesReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];

  constructor(private SDWRRS: SalesReportService,
    private cMSvc: customerMasterService,
    private notificationSvc: NotificationsService,
    private datePipe: DatePipe) { }

  ngOnInit(
  ) { this.getCustomerList(); }

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
    if (this.suggestions.length < 1) this.suggestions = this.customerDetailsList;
  }

  reportForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    customerid: new FormControl(null)
  });

  getSalesNongstReportByFromTodate() {
    if (this.reportForm.valid) {
      const fromDate = this.reportForm.value.fromdate;
      const toDate = this.reportForm.value.todate;
      const cusId = this.reportForm.value.customerid;
      this.SDWRRS.getSalesBillingNongstFromToDate(fromDate, toDate, cusId, this.companyID).subscribe((res) => {
        this.salesReports = res;
      });
    }
    else {
      this.notificationSvc.error('Please enter the required fields !')
    }
  }

  totalQty() {
    let total_Qty = 0;
    total_Qty = this.salesReports.reduce(
      (acc: any, item: any) => (acc += Number(item.qty)),
      0
    );
    return total_Qty;
  }

  totaltotal() {
    let total = 0;
    total = this.salesReports.reduce(
      (acc: any, item: any) => (acc += Number(item.total)),
      0
    );
    return total;
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
