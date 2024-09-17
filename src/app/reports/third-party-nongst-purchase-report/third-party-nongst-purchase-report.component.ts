import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as numberToWords from 'number-to-words';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';

@Component({
  selector: 'app-third-party-nongst-purchase-report',
  templateUrl: './third-party-nongst-purchase-report.component.html',
  styleUrl: './third-party-nongst-purchase-report.component.scss'
})
export class ThirdPartyNongstPurchaseReportComponent implements OnInit {

  activeCompanyDetails: any[] = [];
  companyDetailsList: any[] = [];
  ActiveCompanyName: any;
  ActiveCompanyAddress: any;
  ActiveCompanyState: any;
  totalQty: string;
  totalPrice: string;
  totalAmount: string;
  totalAmountNumber: number;
  totalDiscountAmount: string;
  netTotal: string;
  numberInWords: string;

  thirdPartyNongstPurchaseReports: any[] = [];

  async ngOnInit() {
    await this.getCompanyDetails();

    this.thirdPartyNongstPurchaseReports = this.data.thirdPartyNongstPurchaseReports;

    if (this.thirdPartyNongstPurchaseReports.length > 0) {
      this.getItemTotalQty();
    }

    this.getReport(this.thirdPartyNongstPurchaseReports);
  }

  constructor(
    private CDSVC: companyDetailsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ThirdPartyNongstPurchaseReportComponent>
  ) { }

  closedialog() {
    this.dialogRef.close(false);
  }

  async getCompanyDetails(): Promise<void> {
    this.CDSVC.getList().subscribe(async (res) => {
      this.companyDetailsList = res;
      await this.getActiveCompanyDetails();
    });
  }

  async getActiveCompanyDetails(): Promise<void> {
    let ActiveCompany = this.companyDetailsList.filter(
      (item) => item.activestatus === true
    );
    this.activeCompanyDetails = ActiveCompany;
    this.ActiveCompanyName = ActiveCompany[0].company_name;
    this.ActiveCompanyAddress = ActiveCompany[0].street_name;
    this.ActiveCompanyState = ActiveCompany[0].state;
  }

  getItemTotalQty() {
    const totalQty = this.thirdPartyNongstPurchaseReports.reduce(
      (acc: any, item: any) => (acc += Number(item.qty)),
      0
    );
    this.totalQty = totalQty;
    const totalPrice = this.thirdPartyNongstPurchaseReports.reduce(
      (acc: any, item: any) => (acc += Number(item.price)),
      0
    );
    this.totalPrice = totalPrice;
    const totalAmount = this.thirdPartyNongstPurchaseReports.reduce(
      (acc: any, item: any) => (acc += Number(item.n_total)),
      0
    );
    this.totalAmountNumber = totalAmount;
    this.numberInWords = numberToWords.toWords(this.totalAmountNumber);
    this.totalAmount = totalAmount;

    const totalDiscountAmount = this.thirdPartyNongstPurchaseReports.reduce(
      (acc: number, item: any) => {
        const discountedPrice = item.price * item.qty * (item.discount / 100);
        return acc + discountedPrice;
      },
      0
    );
    this.totalDiscountAmount = String(totalDiscountAmount.toFixed(2));

    const netTotal = this.thirdPartyNongstPurchaseReports.reduce(
      (acc: any, item: any) => (acc += Number(item.n_total)),
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
