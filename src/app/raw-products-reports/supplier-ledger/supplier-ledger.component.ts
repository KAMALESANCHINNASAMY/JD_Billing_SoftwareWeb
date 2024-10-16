import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';
import { financialYearService } from 'src/app/api-service/financialYear.service';
import { rawProductReportService } from 'src/app/api-service/raw_product_report.serivce';
import { SupplierMasterService } from 'src/app/api-service/supplierMaster.service';

@Component({
  selector: 'app-supplier-ledger',
  templateUrl: './supplier-ledger.component.html',
  styleUrl: './supplier-ledger.component.scss'
})
export class SupplierLedgerComponent {
  companyID: number = Number(localStorage.getItem('companyid'));
  supplierDetailsList: any[] = [];
  suggestions: any[] = [];
  salesList: any[] = [];
  companyDetailsList: any;
  customerDet: any;

  constructor(
    private sMSvc: SupplierMasterService,
    private lSvc: rawProductReportService,
    private FINYRSVC: financialYearService,
    private CDSVC: companyDetailsService,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    this.getSupplierList();
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

  getSupplierList() {
    this.sMSvc.getList(this.companyID).subscribe((res: any) => {
      this.supplierDetailsList = res;
      this.suggestions = res;
    });
  }

  suggest(value: any) {
    this.suggestions = this.supplierDetailsList.filter((item) =>
      item.supplier_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1) this.suggestions = this.supplierDetailsList;
  }

  reportForm = new FormGroup({
    supplierid: new FormControl(null),
    fromdate: new FormControl(''),
    todate: new FormControl(''),
  });

  async search() {
    const id = this.reportForm.value.supplierid;
    const fromDate = this.reportForm.value.fromdate;
    const toDate = this.reportForm.value.todate;
    if (this.reportForm.valid) {
      this.salesList = await this.lSvc.getSupplier(id, fromDate, toDate).toPromise() || [];
      this.customerDet = await this.supplierDetailsList.filter((e) => { return e.supplierid == id })[0];
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
