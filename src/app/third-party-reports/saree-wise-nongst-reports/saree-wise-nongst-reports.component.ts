import { Component, OnInit } from '@angular/core';
import { ThirdPartyPurchaseNonGstDebitService } from 'src/app/api-service/Credit-Debit-note/thirdPartyNonGstpurchaseDebit.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-saree-wise-nongst-reports',
  templateUrl: './saree-wise-nongst-reports.component.html',
  styleUrl: './saree-wise-nongst-reports.component.scss',
  providers: [DatePipe]
})
export class SareeWiseNongstReportsComponent implements OnInit {

  purchaseReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));

  constructor(
    private TPPNGSTRSVC: ThirdPartyPurchaseNonGstDebitService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
  }

  getSalesReportbySicode(si_code: any) {
    this.purchaseReports = [];
    this.TPPNGSTRSVC.getThirdPartyNonGstNestedBySiCode(this.companyID, si_code).subscribe((res) => {
      this.purchaseReports = res;
    });
  }

  totalQty() {
    let qty = 0;
    qty = this.purchaseReports.reduce((acc: any, item: any) => (acc += Number(item.qty)), 0);
    return qty;
  }

  totalTotal() {
    let total = 0;
    total = this.purchaseReports.reduce((acc: any, item: any) => (acc += Number(item.total)), 0);
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
