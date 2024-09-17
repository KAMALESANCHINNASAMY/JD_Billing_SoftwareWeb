import { Component,Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';
import { SalesBillgstReportsComponent } from '../sales-billgst-reports/sales-billgst-reports.component';
import * as numberToWords from 'number-to-words';

@Component({
  selector: 'app-sales-billgst-return-reports',
  templateUrl: './sales-billgst-return-reports.component.html',
  styleUrl: './sales-billgst-return-reports.component.scss'
})
export class SalesBillgstReturnReportsComponent implements OnInit {

  activeCompanyDetails: any[] = [];
  companyDetailsList: any[] = [];
  ActiveCompanyName:any;
  ActiveCompanyAddress:any;
  ActiveCompanyState:any;
  parent: any;
  childArray: any[] = [];
  totalQty: string;
  totalReturnQty:string;
  totalPrice: string;
  totalAmount: string;
  totalAmountNumber: number;
  totalDiscountAmount: string;
  totalCgstAmount: string;
  totalSgstAmount: string;
  totalIgstAmount: string;
  totalGstAmount: string;
  netTotal: string;
  numberInWords: string;

 async ngOnInit() {
    await this.getCompanyDetails();
    this.parent = this.data.parentArray;
    this.childArray = this.data.cildArray;
    if (this.childArray && this.childArray.length > 0) {
      this.getItemTotalQty();
    }
  }

  constructor(
    private router: Router,
    private CDSVC: companyDetailsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SalesBillgstReportsComponent>
  ) {}

  getCompanyDetails() {
    this.CDSVC.getList().subscribe((res) => {
      this.companyDetailsList = res;
      this.getActiveCompanyDetails();
    });
  }

  getActiveCompanyDetails() {
    let ActiveCompany = this.companyDetailsList.filter(
      (item) => item.activestatus === true
    );
    this.activeCompanyDetails = ActiveCompany;
    this.ActiveCompanyName=ActiveCompany[0].company_name;
    this.ActiveCompanyAddress=ActiveCompany[0].street_name;
    this.ActiveCompanyState=ActiveCompany[0].state;
  }

  closedialog() {
    this.dialogRef.close(false);
  }

  getItemTotalQty() {
    const totalQty = this.childArray.reduce(
      (acc: any, item: any) => (acc += Number(item.qty)),
      0
    );
    this.totalQty = totalQty;
    const totalReturnQty = this.childArray.reduce(
      (acc: any, item: any) => (acc += Number(item.return_qty)),
      0
    );
    this.totalReturnQty = totalReturnQty;
    const totalPrice = this.childArray.reduce(
      (acc: any, item: any) => (acc += Number(item.price)),
      0
    );
    this.totalPrice = totalPrice;
    const totalAmount = this.childArray.reduce(
      (acc: any, item: any) => (acc += Number(item.return_total)),
      0
    );
    this.totalAmountNumber = totalAmount;
    this.numberInWords = numberToWords.toWords(this.totalAmountNumber);
    this.totalAmount = totalAmount;
    const totalDiscountAmount = this.childArray.reduce(
      (acc: any, item: any) =>
        (acc += Number(item.return_total) * (Number(item.discount) / 100)),
      0
    );
    this.totalDiscountAmount = String(totalDiscountAmount.toFixed(2));
    const totalCgstAmount = this.childArray.reduce(
      (acc: any, item: any) => (acc += Number(item.return_cgst_amount)),
      0
    );
    this.totalCgstAmount = String(totalCgstAmount.toFixed(2));

    const totalSgstAmount = this.childArray.reduce(
      (acc: any, item: any) => (acc += Number(item.return_sgst_amount)),
      0
    );
    this.totalSgstAmount = String(totalSgstAmount.toFixed(2));
    const totalIgstAmount = this.childArray.reduce(
      (acc: any, item: any) => (acc += Number(item.return_igst_amount)),
      0
    );
    this.totalIgstAmount = String(totalIgstAmount.toFixed(2));
    const totalGstAmount =
      Number(totalCgstAmount) +
      Number(totalSgstAmount + Number(totalIgstAmount));
    this.totalGstAmount = String(totalGstAmount.toFixed(2));
    const netTotal = this.childArray.reduce(
      (acc: any, item: any) => (acc += Number(item.return_net_total)),
      0
    );
    this.netTotal = String(netTotal.toFixed(2));
  }

}
