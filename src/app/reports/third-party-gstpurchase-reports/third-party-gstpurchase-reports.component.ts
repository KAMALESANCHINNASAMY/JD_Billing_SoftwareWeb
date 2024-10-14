import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';
import * as numberToWords from 'number-to-words';

@Component({
  selector: 'app-third-party-gstpurchase-reports',
  templateUrl: './third-party-gstpurchase-reports.component.html',
  styleUrl: './third-party-gstpurchase-reports.component.scss'
})
export class ThirdPartyGstpurchaseReportsComponent implements OnInit {

  activeCompanyDetails: any[] = [];
  companyDetailsList: any[] = [];
  ActiveCompanyName: any;
  ActiveCompanyAddress: any;
  ActiveCompanyState: any;
  parent: any;
  childArray: any[] = [];
  totalQty: string;
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

  thirdPartygstPurchaseReports: any[] = [];

  async ngOnInit() {
    await this.getCompanyDetails();
    // this.parent = this.data.parentArray;
    // this.childArray = this.data.cildArray;
    // if (this.childArray && this.childArray.length > 0) {
    //   this.getItemTotalQty();
    // }

    this.thirdPartygstPurchaseReports = this.data.thirdPartygstPurchaseReports;

    if (this.thirdPartygstPurchaseReports.length > 0) {
      this.getItemTotalQty();
    }

    this.getReport(this.thirdPartygstPurchaseReports);
  }

  constructor(
    private router: Router,
    private CDSVC: companyDetailsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ThirdPartyGstpurchaseReportsComponent>
  ) { }

  closedialog() {
    this.dialogRef.close(false);
  }

  async getCompanyDetails() {
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
    this.ActiveCompanyName = ActiveCompany[0].company_name;
    this.ActiveCompanyAddress = ActiveCompany[0].street_name;
    this.ActiveCompanyState = ActiveCompany[0].state;
  }

  getItemTotalQty() {
    const totalQty = this.thirdPartygstPurchaseReports.reduce(
      (acc: any, item: any) => (acc += Number(item.qty)),
      0
    );
    this.totalQty = totalQty;
    const totalPrice = this.thirdPartygstPurchaseReports.reduce(
      (acc: any, item: any) => (acc += Number(item.price)),
      0
    );
    this.totalPrice = totalPrice;
    const totalAmount = this.thirdPartygstPurchaseReports.reduce(
      (acc: any, item: any) => (acc += Number(item.n_total)),
      0
    );
    this.totalAmountNumber = totalAmount;
    this.numberInWords = numberToWords.toWords(this.totalAmountNumber);
    this.totalAmount = totalAmount;

    const totalDiscountAmount = this.thirdPartygstPurchaseReports.reduce(
      (acc: number, item: any) => {
        const discountedPrice = item.price * item.qty * (item.discount / 100);
        return acc + discountedPrice;
      },
      0
    );
    this.totalDiscountAmount = String(totalDiscountAmount);


    const totalCgstAmount = this.thirdPartygstPurchaseReports.reduce(
      (acc: any, item: any) => (acc += Number(item.cgst_amount)),
      0
    );
    this.totalCgstAmount = String(totalCgstAmount.toFixed(2));

    const totalSgstAmount = this.thirdPartygstPurchaseReports.reduce(
      (acc: any, item: any) => (acc += Number(item.sgst_amount)),
      0
    );
    this.totalSgstAmount = String(totalSgstAmount.toFixed(2));
    const totalIgstAmount = this.thirdPartygstPurchaseReports.reduce(
      (acc: any, item: any) => (acc += Number(item.igst_amount)),
      0
    );
    this.totalIgstAmount = String(totalIgstAmount.toFixed(2));
    const totalGstAmount =
      Number(totalCgstAmount) +
      Number(totalSgstAmount + Number(totalIgstAmount));
    this.totalGstAmount = String(totalGstAmount.toFixed(2));
    const netTotal = this.thirdPartygstPurchaseReports.reduce(
      (acc: any, item: any) => (acc += Number(item.net_total)),
      0
    );
    this.netTotal = String(netTotal.toFixed(2));
  }

  //////////////// KAMALESAN CHANGES----------------

  gst_in: string = '';
  date: string = '';
  party_name: string = '';
  invoice_no: string = '';
  shipping_address: string = '';
  state: string = '';
  state_code: string = '';
  cust_ship_address: string = '';
  getReport(item: any) {
    this.gst_in = item[0].gst_in;
    this.date = item[0].date;
    this.party_name = item[0].party_name;
    this.shipping_address = item[0].shipping_address;
    this.state = item[0].state;
    this.state_code = item[0].state_code;
    this.invoice_no = item[0].invoice_no;
    this.cust_ship_address = item[0].cust_ship_address;
  }

}
