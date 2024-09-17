import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';
import { financialYearService } from 'src/app/api-service/financialYear.service';
import { LedgerReportsService } from 'src/app/api-service/ledgerreports.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';

@Component({
  selector: 'app-third-party-nongst-ledger',
  standalone: false,
  templateUrl: './third-party-nongst-ledger.component.html',
  styleUrl: './third-party-nongst-ledger.component.scss',
  providers: [DatePipe]
})
export class ThirdPartyNongstLedgerComponent {
  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  suggestions: any[] = [];
  purchaseList: any[] = [];
  companyDetailsList: any;
  thirdPartyDet: any;

  constructor(
    private tHMSVC: thirdPartyMasterService,
    private lSvc: LedgerReportsService,
    private FINYRSVC: financialYearService,
    private CDSVC: companyDetailsService,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    this.getThirdPartyList();
    await this.getActiveFinYr();
    await this.getCompanyDetails();
  }

  async getCompanyDetails() {
    this.CDSVC.getList().subscribe((res) => {
      const newArray = res.filter((e) => { return e.activestatus });
      this.companyDetailsList = newArray[0];
    });
  }

  async getActiveFinYr() {
    this.FINYRSVC.getActiveFinYear(this.companyID).subscribe((res: any) => {
      this.reportForm.get('fromdate')?.setValue(res[0].fromdate);
      this.reportForm.get('todate')?.setValue(res[0].todate);
    });
  }

  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.suggestions = res;
    });
  }

  gstSuggest(value: any) {
    this.suggestions = this.thirdPartyDetailsList.filter((item) =>
      item.party_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.thirdPartyDetailsList;
  }

  reportForm = new FormGroup({
    third_partyid: new FormControl(null),
    fromdate: new FormControl(''),
    todate: new FormControl(''),
  });

  async search() {
    const id = this.reportForm.value.third_partyid;
    const fromDate = this.reportForm.value.fromdate;
    const toDate = this.reportForm.value.todate;
    if (this.reportForm.valid) {
      this.purchaseList = await this.lSvc.getThirdPartyNonGst(id, fromDate, toDate).toPromise() || [];
      this.thirdPartyDet = await this.thirdPartyDetailsList.filter((e) => { return e.third_partyid == id })[0];
    }
  }

  calcSumUpToIndex(index: number) {
    if (index >= this.purchaseList.length) {
      index = this.purchaseList.length - 1;
    }

    const newArray = this.purchaseList.slice(0, index + 1);

    let debit = 0;
    let credit = 0;
    debit = newArray.reduce((acc, val) => acc += val.debit, 0);
    credit = newArray.reduce((acc, val) => acc += val.credit, 0);

    return debit - credit;
  }

  getdebit() {
    let debit = 0;
    debit = this.purchaseList.reduce((acc, val) => acc += val.debit, 0);
    return debit;
  }

  getcredit() {
    let credit = 0;
    credit = this.purchaseList.reduce((acc, val) => acc += val.credit, 0);
    return credit;
  }

  getclobal() {
    return this.getdebit() - this.getcredit();
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
