import { Component, OnInit, signal } from '@angular/core';
import { dashBoardService } from '../api-service/dashboard.service';
import { salesBillgstReportService } from '../api-service/reports/salesBillgstReport.service';
import { salesBillingService } from '../api-service/Accounts/salesBilling.service';
import { salesBillingServiceNonGST } from '../api-service/Accounts/salesBillingNonGST.service';
import { salesBillNongstReportService } from '../api-service/reports/salesBillNongstReport.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {
  companyID: number = Number(localStorage.getItem('companyid'));
  readonly panelOpenState = signal(false);
  readonly panelOpenStatewithoutgst = signal(false);
  today = new Date().toISOString().slice(0, 10)

  customerPaymentRemminderList: any[] = [];
  customerPaymentNongstRemminderList: any[] = [];
  constructor(private dASvc: dashBoardService,
    private SBREGSTDSVC: salesBillgstReportService,
    private sBSvc: salesBillingService,
    private sBNSvc: salesBillingServiceNonGST,
    private SBNOGSTREPSVC: salesBillNongstReportService,
    private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.getCustomerPaymentGstList();
    this.getCustomerPaymentNonGstList();
  }

  getCustomerPaymentGstList() {
    this.dASvc.getListGst(this.today, this.companyID).subscribe((res) => {
      this.customerPaymentRemminderList = res;

      if (res.length > 0) {
        this.panelOpenState.set(true);
      }
    });
  }

  async getReport(entryid: number) {
    const multipleSalesList = await this.sBSvc.getMultipleSalesReport(entryid).toPromise();
    this.SBREGSTDSVC.openConfirmDialog(multipleSalesList)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
        }
      });
  }

  getCustomerPaymentNonGstList() {
    this.dASvc.getListNonGst(this.today, this.companyID).subscribe((res) => {
      this.customerPaymentNongstRemminderList = res;

      if (res.length > 0) {
        this.panelOpenStatewithoutgst.set(true);
      }
    });
  }

  async getReportNonGst(entryid: number) {
    const multipleSalesList = await this.sBNSvc.getMultipleSalesReport(entryid).toPromise();
    this.SBNOGSTREPSVC.openConfirmDialog(multipleSalesList)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
        }
      });
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
