import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { financialYearService } from 'src/app/api-service/financialYear.service';
import { salesProductReportService } from 'src/app/api-service/salesProductReport.service';

@Component({
  selector: 'app-sales-ledger',
  templateUrl: './sales-ledger.component.html',
  styleUrl: './sales-ledger.component.scss'
})
export class SalesLedgerComponent {
  companyID: number = Number(localStorage.getItem('companyid'));
  customerDetailsList: any[] = [];
  suggestions: any[] = [];
  salesList: any[] = [];
  companyDetailsList: any;
  customerDet: any;

  constructor(
    private cMSvc: customerMasterService,
    private lSvc: salesProductReportService,
    private FINYRSVC: financialYearService,
    private CDSVC: companyDetailsService,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    this.getCustomerList();
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

  getCustomerList() {
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.customerDetailsList = res;
      this.suggestions = res;
    });
  }

  gstSuggest(value: any) {
    this.suggestions = this.customerDetailsList.filter((item) =>
      item.customer_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.customerDetailsList;
  }

  reportForm = new FormGroup({
    customerid: new FormControl(null),
    fromdate: new FormControl(''),
    todate: new FormControl(''),
  });

  async search() {
    const id = this.reportForm.value.customerid;
    const fromDate = this.reportForm.value.fromdate;
    const toDate = this.reportForm.value.todate;
    if (this.reportForm.valid) {
      this.salesList = await this.lSvc.getSalesLed(id, fromDate, toDate).toPromise() || [];
      this.customerDet = await this.customerDetailsList.filter((e) => { return e.customerid == id })[0];
    }
  }

  calcSumUpToIndex(index: number) {
    if (index >= this.salesList.length) {
      index = this.salesList.length - 1;
    }

    const newArray = this.salesList.slice(0, index + 1);

    let debit = 0;
    let credit = 0;
    debit = newArray.reduce((acc, val) => acc += val.debit, 0);
    credit = newArray.reduce((acc, val) => acc += val.credit, 0);

    return debit - credit;
  }

  getdebit() {
    let debit = 0;
    debit = this.salesList.reduce((acc, val) => acc += val.debit, 0);
    return debit;
  }

  getcredit() {
    let credit = 0;
    credit = this.salesList.reduce((acc, val) => acc += val.credit, 0);
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
