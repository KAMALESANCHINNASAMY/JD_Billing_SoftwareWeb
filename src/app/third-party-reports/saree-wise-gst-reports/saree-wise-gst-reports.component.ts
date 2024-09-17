import { Component, OnInit } from '@angular/core';
import { ThirdPartyPurchaseGstDebitService } from 'src/app/api-service/Credit-Debit-note/thirdPartyGstPurchaseDebit.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-saree-wise-gst-reports',
  templateUrl: './saree-wise-gst-reports.component.html',
  styleUrl: './saree-wise-gst-reports.component.scss',
  providers: [DatePipe]
})
export class SareeWiseGstReportsComponent implements OnInit {

  purchaseReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));

  constructor(
    private TPPGSTRSVC: ThirdPartyPurchaseGstDebitService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
  }

  getSalesReportbySicode(si_code: any) {
    this.purchaseReports = [];
    this.TPPGSTRSVC.getThirdPartyGstNestedBySiCode(this.companyID, si_code).subscribe((res) => {
      this.purchaseReports = res;
    });
  }

  totalQty() {
    let qty = 0;
    qty = this.purchaseReports.reduce((acc: any, item: any) => (acc += Number(item.qty)), 0);
    return qty;
  }

  total_nettotal() {
    let total = 0;
    total = this.purchaseReports.reduce((acc: any, item: any) => (acc += Number(item.net_total)), 0);
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
