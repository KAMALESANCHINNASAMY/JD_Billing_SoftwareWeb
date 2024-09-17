import { Component, Inject, OnInit } from '@angular/core';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { numberToWordsWithDecimal } from 'src/app/utils/numbertowords';

@Component({
  selector: 'app-sales-billnongst-reports',
  templateUrl: './sales-billnongst-reports.component.html',
  styleUrl: './sales-billnongst-reports.component.scss',
  providers: [DatePipe]
})
export class SalesBillnongstReportsComponent implements OnInit {
  companyID: number = Number(localStorage.getItem('companyid'));
  companyDetailsList: any;
  parent: any;
  multipleSalesNongstList: any[] = [];
  customerDetailsList: any;
  emptyArray: any[] = [];

  async ngOnInit() {
    await this.getCompanyDetails();
    this.parent = this.data.multipleSalesNongstList[0];
    this.multipleSalesNongstList = this.data.multipleSalesNongstList;
    await this.ensureLength(this.multipleSalesNongstList.length);
    this.getCustomerList();
  }

  constructor(
    private CDSVC: companyDetailsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SalesBillnongstReportsComponent>,
    private datePipe: DatePipe,
    private cMSvc: customerMasterService
  ) { }

  closedialog() {
    this.dialogRef.close(false);
  }

  async ensureLength(lenth: number): Promise<void> {
    this.emptyArray = [];
    if (lenth < 21) {
      for (let i = lenth; i < 21; i++) {
        this.emptyArray.push([]);
      }
    }
  }

  async getCompanyDetails() {   
    this.CDSVC.getList().subscribe((res) => {
      const newArray = res.filter((e) => { return e.activestatus });
      this.companyDetailsList = newArray[0];
    });
  }

  getCustomerList() {
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.customerDetailsList = res.find((e) => { return e.customerid == this.parent.customerid });
    });
  }

  gettotalQty() {
    let qty = 0;
    qty = this.multipleSalesNongstList.reduce((acc, val) => (acc += Number(val.qty)), 0);
    return qty;
  }

  gettotalamountwithoutdis() {
    let totalAmount = 0;
    totalAmount = this.multipleSalesNongstList.reduce((acc, val) => (acc += Number(Number(val.price) * Number(val.qty))), 0);
    return totalAmount.toFixed(2);
  }

  getDis() {
    let discount = 0;
    discount = this.multipleSalesNongstList.reduce((acc, val) => (acc += Number(val.discount)), 0);

    return (discount / this.multipleSalesNongstList.length);
  }
  gettotalDis() {
    let totalAmount = 0;
    totalAmount = this.multipleSalesNongstList.reduce((acc, val) => (acc += Number((Number(val.price) * Number(val.qty)) * (Number(val.discount) / 100))), 0);
    return totalAmount.toFixed(2);
  }

  gettotalAmount() {
    let n_total = 0;
    n_total = this.multipleSalesNongstList.reduce((acc, val) => (acc += Number(val.n_total)), 0);
    return n_total.toFixed(2);
  }

  getnumberInWords() {
    let total = 0;
    total = this.multipleSalesNongstList.reduce((acc, val) => (acc += Number(val.n_total)), 0);
    return numberToWordsWithDecimal(Number(total));
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
