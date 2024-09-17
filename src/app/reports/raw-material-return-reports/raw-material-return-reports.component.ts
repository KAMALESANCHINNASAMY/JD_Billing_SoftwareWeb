import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';
import { SupplierMasterService } from 'src/app/api-service/supplierMaster.service';
import { numberToWordsWithDecimal } from '../../utils/numbertowords';  // Adjust the path as necessary

@Component({
  selector: 'app-raw-material-return-reports',
  templateUrl: './raw-material-return-reports.component.html',
  styleUrl: './raw-material-return-reports.component.scss'
})
export class RawMaterialReturnReportsComponent implements OnInit {
  companyID: number = Number(localStorage.getItem('companyid'));
  companyDetailsList: any;
  supplierDetail: any;
  emptyArray: any[] = [];
  parent: any;
  childArray: any[] = [];
  numberInWords: string;

  totalQty: string;
  totalReturnQty: string;
  totalAmount: string;
  totalAmountNumber: number;
  totalDiscountAmount: string;
  totalCgstAmount: string;
  totalSgstAmount: string;
  totalIgstAmount: string;
  totalGstAmount: string;
  netTotal: string;

  async ngOnInit() {
    await this.getCompanyDetails();
    await this.getSupplierList();

    this.parent = this.data.parentArray;
    this.childArray = this.data.cildArray;

    await this.ensureLength(this.childArray.length);
  }

  constructor(
    private CDSVC: companyDetailsService,
    private sMSvc: SupplierMasterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RawMaterialReturnReportsComponent>
  ) { }

  async ensureLength(lenth: number): Promise<void> {
    this.emptyArray = [];
    if (lenth < 18) {
      for (let i = lenth; i < 18; i++) {
        this.emptyArray.push([]);
      }
    }
  }

  async getCompanyDetails() {
    this.companyDetailsList = [];
    this.CDSVC.getList().subscribe((res) => {
      const newArray = res.filter((e) => { return e.activestatus });
      this.companyDetailsList = newArray[0];
    });
  }

  async getSupplierList() {
    this.sMSvc.getList(this.companyID).subscribe((res) => {
      this.supplierDetail = res.find(e => e.supplierid === this.data.parentArray.supplierid) || {};
    });
  }

  getTotQty() {
    let return_qty = 0;
    return_qty = this.childArray.reduce((acc: any, item: any) => (acc += Number(item.return_qty)), 0);
    return return_qty;
  }

  getTotAmount() {
    let amount = 0;
    amount = this.childArray.reduce((acc: any, item: any) => (acc += Number(item.return_qty) * Number(item.price)), 0);
    return amount;
  }

  getgst() {
    let gst_percentage = 0;
    gst_percentage = this.childArray.reduce((acc, val) => (acc += Number(val.gst_percentage)), 0);
    return (gst_percentage / this.childArray.length);
  }

  getDis() {
    let discount = 0;
    discount = this.childArray.reduce((acc, val) => (acc += Number(val.discount)), 0);
    return (discount / this.childArray.length);
  }

  gettotalDis() {
    let amount = 0;
    amount = this.childArray.reduce((acc, val) => (acc += Number((Number(val.price) * Number(val.return_qty)) * (Number(val.discount) / 100))), 0);
    return amount;
  }

  getTaxableVal() {
    return this.getTotAmount() - this.gettotalDis();
  }

  gettotalCgstAmount() {
    let cgst_amount = 0;
    cgst_amount = this.childArray.reduce((acc, val) => (acc += Number(val.cgst_amount)), 0);
    return cgst_amount.toFixed(2);
  }

  gettotalSgstAmount() {
    let sgst_amount = 0;
    sgst_amount = this.childArray.reduce((acc, val) => (acc += Number(val.sgst_amount)), 0);
    return sgst_amount.toFixed(2);
  }

  gettotalIgstAmount() {
    let igst_amount = 0;
    igst_amount = this.childArray.reduce((acc, val) => (acc += Number(val.igst_amount)), 0);
    return igst_amount.toFixed(2);
  }

  gettotalGstAmount() {
    return Number(this.gettotalCgstAmount()) + Number(this.gettotalSgstAmount()) + Number(this.gettotalIgstAmount());
  }

  getNetTotal() {
    let return_net_total = 0;
    return_net_total = this.childArray.reduce((acc, val) => (acc += Number(val.return_net_total)), 0);
    this.numberInWords = numberToWordsWithDecimal(Number(return_net_total));
    return return_net_total.toFixed(2);
  }

  closedialog() {
    this.dialogRef.close(false);
  }
}
