import { Component,Inject,OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';
import { SalesBillnongstReportsComponent } from '../sales-billnongst-reports/sales-billnongst-reports.component';
import { salesBillNongstReturnReportService } from 'src/app/api-service/reports/salesBillNongstReturnReport.service';
import * as numberToWords from 'number-to-words';

@Component({
  selector: 'app-sales-billnongst-return-reports',
  templateUrl: './sales-billnongst-return-reports.component.html',
  styleUrl: './sales-billnongst-return-reports.component.scss'
})
export class SalesBillnongstReturnReportsComponent implements OnInit {

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
  numberInWords: string;
  totalAmountNumber:number;
  totalDiscountAmount: string;
  netTotal: string;


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
    public dialogRef: MatDialogRef<salesBillNongstReturnReportService>
  ) {}

  closedialog() {
    this.dialogRef.close(false);
  }

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

  getItemTotalQty(){

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
    const netTotal = this.childArray.reduce(
      (acc: any, item: any) => (acc += Number(item.return_total)),
      0
    );
    this.netTotal = String(netTotal.toFixed(2));

  }

}
