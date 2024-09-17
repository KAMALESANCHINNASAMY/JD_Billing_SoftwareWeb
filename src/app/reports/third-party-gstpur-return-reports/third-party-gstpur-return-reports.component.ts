import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as numberToWords from 'number-to-words';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';
import { SalesBillgstReportsComponent } from '../sales-billgst-reports/sales-billgst-reports.component';

@Component({
  selector: 'app-third-party-gstpur-return-reports',
  templateUrl: './third-party-gstpur-return-reports.component.html',
  styleUrl: './third-party-gstpur-return-reports.component.scss'
})
export class ThirdPartyGstpurReturnReportsComponent implements OnInit {

  companyDetailsList: any;
  parent: any;
  childArray: any[] = [];
  numberInWords: string = '';

  async ngOnInit() {
    await this.getCompanyDetails();
    this.parent = this.data.parentArray;
    this.childArray = this.data.cildArray;
  }

  constructor(
    private CDSVC: companyDetailsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SalesBillgstReportsComponent>
  ) { }

  getCompanyDetails() {
    this.companyDetailsList = [];
    this.CDSVC.getList().subscribe((res) => {
      const newArray = res.filter((e) => { return e.activestatus });
      this.companyDetailsList = newArray[0];
    });
  }

  closedialog() {
    this.dialogRef.close(false);
  }

  getRetTotQty() {
    let val = 0;
    val = this.childArray.reduce((acc: any, item: any) => (acc += Number(item.return_qty)), 0);
    return val;
  }

  getRetTotAmount() {
    let val = 0;
    val = this.childArray.reduce((acc: any, item: any) => (acc += (Number(item.return_qty) * Number(item.price))), 0);
    return val;
  }

  getTotCGST() {
    let val = 0;
    val = this.childArray.reduce((acc: any, item: any) => (acc += Number(item.return_cgst_amount)), 0);
    return val;
  }

  getTotSGST() {
    let val = 0;
    val = this.childArray.reduce((acc: any, item: any) => (acc += Number(item.return_sgst_amount)), 0);
    return val;
  }

  getTotIGST() {
    let val = 0;
    val = this.childArray.reduce((acc: any, item: any) => (acc += Number(item.return_igst_amount)), 0);
    return val;
  }

  getTotDis() {
    let val = 0;
    val = this.childArray.reduce((acc: any, item: any) =>
      (acc += (Number(item.return_qty) * Number(item.price)) * (Number(item.discount) / 100)),
      0
    );
    return val;
  }

  getTotGst() {
    let val = 0;
    val = this.getTotCGST() + this.getTotSGST() + this.getTotIGST();
    return val;
  }

  getTotNetTot() {
    let val = 0;
    val = this.childArray.reduce((acc: any, item: any) => (acc += Number(item.return_net_total)), 0);
    this.numberInWords = numberToWords.toWords(val);
    return val;
  }

  getnumberInWords() {
    let val = 0;
    val = this.childArray.reduce((acc: any, item: any) => (acc += Number(item.return_net_total)), 0);

    return numberToWords.toWords(Number(val));
  }

}
