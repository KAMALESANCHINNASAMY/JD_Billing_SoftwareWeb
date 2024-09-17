import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { salesBillingService } from 'src/app/api-service/Accounts/salesBilling.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { salesBillgstReportService } from 'src/app/api-service/reports/salesBillgstReport.service';
import { SalesReportService } from 'src/app/api-service/sales-reports/sales-report.service';

@Component({
  selector: 'app-customer-wise-salesgst-reports',
  templateUrl: './customer-wise-salesgst-reports.component.html',
  styleUrl: './customer-wise-salesgst-reports.component.scss',
  providers: [DatePipe]
})
export class CustomerWiseSalesgstReportsComponent implements OnInit {

  salesReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  customerDetailsList: any[] = [];
  suggestions: any[] = [];

  constructor(
    private SRSVC: SalesReportService,
    private cMSvc: customerMasterService,
    private sBSvc: salesBillingService,
    private SBREGSTDSVC: salesBillgstReportService,
    private notificationSvc: NotificationsService,
    private datePipe: DatePipe
  ) {
  }

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

  showCustomerSalesReport(customerid: any) {
    if (customerid >= 0) {
      this.SRSVC.getSalesReportByCustomerid(customerid, this.companyID).subscribe(
        (res) => {
          this.salesReports = res;
        }
      );
    }
    else {
      this.notificationSvc.error('Please enter the required fields !')
    }
  }

  async getReport(item: any) {
    const multipleSalesList = await this.sBSvc.getMultipleSalesReport(item.entryid).toPromise();
    this.SBREGSTDSVC.openConfirmDialog(multipleSalesList)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
        }
      });
  }

  totalTotal() {
    let total_net_total = 0;
    total_net_total = this.salesReports.reduce(
      (acc: any, item: any) => (acc += Number(item.net_total)),
      0
    );
    return total_net_total;
  }

  totalQty() {
    let total_Qty = 0;
    total_Qty = this.salesReports.reduce((acc: any, item: any) => (acc += Number(item.qty)), 0);
    return total_Qty;
  }
  totalTot() {
    let total_Qty = 0;
    total_Qty = this.salesReports.reduce((acc: any, item: any) => (acc += Number(item.total)), 0);
    return total_Qty.toFixed(2);
  }
  totalCgst() {
    let total_Qty = 0;
    total_Qty = this.salesReports.reduce((acc: any, item: any) => (acc += Number(item.cgst_amount)), 0);
    return total_Qty.toFixed(2);
  }
  totalSgst() {
    let total_Qty = 0;
    total_Qty = this.salesReports.reduce((acc: any, item: any) => (acc += Number(item.sgst_amount)), 0);
    return total_Qty.toFixed(2);
  }
  totalIgst() {
    let total_Qty = 0;
    total_Qty = this.salesReports.reduce((acc: any, item: any) => (acc += Number(item.igst_amount)), 0);
    return total_Qty.toFixed(2);
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
