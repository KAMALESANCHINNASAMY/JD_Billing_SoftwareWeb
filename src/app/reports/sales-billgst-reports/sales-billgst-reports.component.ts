import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';
import { DatePipe } from '@angular/common';
import { numberToWordsWithDecimal } from '../../utils/numbertowords';  // Adjust the path as necessary
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
@Component({
  selector: 'app-sales-billgst-reports',
  templateUrl: './sales-billgst-reports.component.html',
  styleUrl: './sales-billgst-reports.component.scss',
  providers: [DatePipe]
})
export class SalesBillgstReportsComponent implements OnInit {
  companyID: number = Number(localStorage.getItem('companyid'));
  customerDetailsList: any;
  parent: any;
  companyDetailsList: any;
  numberInWords: string = '';
  multipleSalesListReport: any[] = [];
  emptyArray: any[] = [];

  async ngOnInit() {
    await this.getCompanyDetails();
    this.parent = this.data.multipleSalesListReport[0];
    this.multipleSalesListReport = this.data.multipleSalesListReport;
    await this.ensureLength15(this.multipleSalesListReport.length);

    this.getCustomerList();
  }

  constructor(
    private CDSVC: companyDetailsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SalesBillgstReportsComponent>,
    private datePipe: DatePipe,
    private cMSvc: customerMasterService
  ) { }

  getCustomerList() {
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.customerDetailsList = res.find((e) => { return e.customerid == this.parent.customerid });
    });
  }

  async ensureLength15(lenth: number): Promise<void> {
    this.emptyArray = [];
    if (lenth < 18) {
      for (let i = lenth; i < 18; i++) {
        this.emptyArray.push([]);
      }
    }
  }

  closedialog() {
    this.dialogRef.close(false);
  }

  async getCompanyDetails() {
    this.CDSVC.getList().subscribe((res) => {
      const newArray = res.filter((e) => { return e.activestatus });
      this.companyDetailsList = newArray[0];
    });
  }

  gettotalQty() {
    let qty = 0;
    qty = this.multipleSalesListReport.reduce((acc, val) => (acc += Number(val.qty)), 0);
    return qty;
  }

  gettotalamountwithoutdis() {
    let totalAmount = 0;
    totalAmount = this.multipleSalesListReport.reduce((acc, val) => (acc += Number(Number(val.price) * Number(val.qty))), 0);
    return totalAmount.toFixed(2);
  }

  getDis() {
    let discount = 0;
    discount = this.multipleSalesListReport.reduce((acc, val) => (acc += Number(val.discount)), 0);
    return (discount / this.multipleSalesListReport.length);
  }

  gettotalDis() {
    let totalAmount = 0;
    totalAmount = this.multipleSalesListReport.reduce((acc, val) => (acc += Number((Number(val.price) * Number(val.qty)) * (Number(val.discount) / 100))), 0);
    return totalAmount.toFixed(2);
  }

  gettotalAmount() {
    let n_total = 0;
    n_total = this.multipleSalesListReport.reduce((acc, val) => (acc += Number(val.n_total)), 0);
    return n_total.toFixed(2);
  }

  getgst() {
    let gst_percentage = 0;
    gst_percentage = this.multipleSalesListReport.reduce((acc, val) => (acc += Number(val.gst_percentage)), 0);
    return (gst_percentage / this.multipleSalesListReport.length) / 2;
  }

  gettotalCgstAmount() {
    let cgst_amount = 0;
    cgst_amount = this.multipleSalesListReport.reduce((acc, val) => (acc += Number(val.cgst_amount)), 0);
    return cgst_amount.toFixed(2);
  }

  gettotalSgstAmount() {
    let sgst_amount = 0;
    sgst_amount = this.multipleSalesListReport.reduce((acc, val) => (acc += Number(val.sgst_amount)), 0);
    return sgst_amount.toFixed(2);
  }

  gettotalIgstAmount() {
    let igst_amount = 0;
    igst_amount = this.multipleSalesListReport.reduce((acc, val) => (acc += Number(val.igst_amount)), 0);
    return igst_amount.toFixed(2);
  }

  getNetTotal() {
    let net_total = 0;
    net_total = this.multipleSalesListReport.reduce((acc, val) => (acc += Number(val.net_total)), 0);
    this.numberInWords = numberToWordsWithDecimal(Number(net_total));
    return net_total.toFixed(2);
  }

  getnumberInWords() {
    let net_total = 0;
    net_total = this.multipleSalesListReport.reduce((acc, val) => (acc += Number(val.net_total)), 0);
    return numberToWordsWithDecimal(Number(net_total));
  }

  getFormattedDate(dateString: string): string | null {
    if (dateString) {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'dd-MM-yyyy');
    } else {
      return '';
    }
  }


  formatRefCode(ref_code: string): string {
    const parts = ref_code.split(',');
    let formattedCode = '';
    parts.forEach((part, index) => {
      formattedCode += part;
      if ((index + 1) % 7 === 0) {
        formattedCode += ',<br/>'; // Add a comma and a line break after every 9th element
      } else if (index < parts.length - 1) {
        formattedCode += ','; // Add a comma if it's not the last element
      }
    });
    return formattedCode;
  }
}
