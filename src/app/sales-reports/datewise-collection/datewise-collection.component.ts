import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { SalesReportService } from 'src/app/api-service/sales-reports/sales-report.service';

@Component({
  selector: 'app-datewise-collection',
  templateUrl: './datewise-collection.component.html',
  styleUrl: './datewise-collection.component.scss',
  providers: [DatePipe]
})
export class DatewiseCollectionComponent implements OnInit {
  salesReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];
  customerDetailsList: any[] = [];

  constructor(private SDWRRS: SalesReportService,
    private cMSvc: customerMasterService,
    private notificationSvc: NotificationsService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.getCustomerList();
  }

  reportForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    customerid: new FormControl(null)
  });

  getCustomerList() {
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.customerDetailsList = res;
      this.suggestions = res;
    });
  }

  getSalesReportByFromTodate() {
    if (this.reportForm.valid) {
      const fromDate = this.reportForm.value.fromdate;
      const toDate = this.reportForm.value.todate;
      const cusId = this.reportForm.value.customerid;
      this.SDWRRS.getSalesBillingFromToDate(fromDate, toDate, cusId, this.companyID).subscribe((res) => {
        this.salesReports = res;
      });
    }
    else {
      this.notificationSvc.error('Please enter the required fields !')
    }
  }

  suggest(value: any) {
    this.suggestions = this.customerDetailsList.filter((item) =>
      item.customer_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1) this.suggestions = this.customerDetailsList;
  }

  totalQty() {
    let total_Qty = 0;
    total_Qty = this.salesReports.reduce(
      (acc: any, item: any) => (acc += Number(item.qty)),
      0
    );
    return total_Qty;
  }

  totalnet_total() {
    let total_net_total = 0;
    total_net_total = this.salesReports.reduce(
      (acc: any, item: any) => (acc += Number(item.net_total)),
      0
    );
    return total_net_total;
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
