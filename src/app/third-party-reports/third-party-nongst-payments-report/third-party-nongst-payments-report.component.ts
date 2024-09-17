import { Component } from '@angular/core';
import { ThirdPartyReportsService } from 'src/app/api-service/third-party-reports/third-party-purchase-reports.service';
import { DatePipe } from '@angular/common';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';
@Component({
  selector: 'app-third-party-nongst-payments-report',
  templateUrl: './third-party-nongst-payments-report.component.html',
  styleUrl: './third-party-nongst-payments-report.component.scss',
  providers: [DatePipe]
})
export class ThirdPartyNongstPaymentsReportComponent {

  thirdPartyDetailsList: any[] = [];
  PaymentReportsAll: any[] = [];
  PaymentReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];

  constructor(private TPRSVC: ThirdPartyReportsService,
    private tHMSVC: thirdPartyMasterService,
    private datePipe: DatePipe,) { }

  ngOnInit(): void {
    this.getThirdPartyList();
  }

  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.suggestions = res;
    });
  }

  getSalesPaymentReports(fromdate: any, todate: any) {
    this.TPRSVC.getThirdPartyNongstPurchasePaymentFromToDate(fromdate, todate, this.companyID).subscribe((res) => {
      this.PaymentReportsAll = res;
      this.PaymentReports = res;
    });
  }

  showCustomerReturnReport(id: any) {
    this.PaymentReports = this.PaymentReportsAll.filter((e) => { return e.third_partyid == id })
  }

  suggest(value: any) {
    this.suggestions = this.thirdPartyDetailsList.filter((item) =>
      item.party_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.thirdPartyDetailsList;
  }

  getFormattedDate(dateString: string): string | null {
    if (dateString) {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'dd-MM-yyyy');
    } else {
      return '';
    }
  }

  totalTotal() {
    let total = 0;
    total = this.PaymentReports.reduce((acc: any, item: any) => (acc += Number(item.total_amount)), 0);
    return total;
  }

  totalnettotal() {
    let deduction_amount = 0;
    deduction_amount = this.PaymentReports.reduce((acc: any, item: any) => (acc += Number(item.deduction_amount)), 0);
    return deduction_amount;
  }
}
