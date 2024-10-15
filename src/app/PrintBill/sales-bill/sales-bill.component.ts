import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { NgxPrintModule } from 'ngx-print';
import { numberToWordsWithDecimal } from 'src/app/utils/numbertowords';

@Component({
  selector: 'app-sales-bill',
  standalone: true,
  imports: [NgxPrintModule, CommonModule],
  templateUrl: './sales-bill.component.html',
  styleUrl: './sales-bill.component.scss',
  providers: [DatePipe]
})
export class SalesBillComponent {
  companyID: number = Number(localStorage.getItem('companyid'));
  companyDetailsList: any;
  customerDetailsList: any;
  parent: any;
  child: any[] = [];
  numberInWords: string = '';
  emptyArray: any[] = [];
  async ngOnInit() {
    await this.getCompanyDetails();
    this.parent = this.data.parent;
    this.child = this.data.child;
    await this.ensureLength15(this.child.length);
    this.getCustomerList();
  }

  constructor(
    private CDSVC: companyDetailsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SalesBillComponent>,
    private datePipe: DatePipe,
    private cMSvc: customerMasterService
  ) { }

  closedialog() {
    this.dialogRef.close(false);
  }

  async getCompanyDetails() {
    this.CDSVC.getList().subscribe((res) => {
      const newArray = res.filter((e) => { return e.activestatus });
      this.companyDetailsList = newArray[0];
    });
  }

  async ensureLength15(lenth: number): Promise<void> {
    this.emptyArray = [];
    if (lenth < 11) {
      for (let i = lenth; i < 11; i++) {
        this.emptyArray.push([]);
      }
    }
  }

  getCustomerList() {
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.customerDetailsList = res.find((e) => { return e.customerid == this.parent.customerid });
    });
  }

  getTotal() {
    let amount = 0;
    amount = this.child.reduce((acc, val) => (acc += Number(val.net_total)), 0);
    this.numberInWords = numberToWordsWithDecimal(Number(amount));
    return amount.toFixed(2);
  }

  getTotalQty() {
    let amount = 0;
    amount = this.child.reduce((acc, val) => (acc += Number(val.qty)), 0);
    this.numberInWords = numberToWordsWithDecimal(Number(amount));
    return amount;
  }
  gettxableAmount() {
    let amount = 0;
    amount = this.child.reduce((acc, val) => (acc += Number(val.total)), 0);
    this.numberInWords = numberToWordsWithDecimal(Number(amount));
    return amount.toFixed(2);
  }
  getcgstAmount() {
    let amount = 0;
    amount = this.child.reduce((acc, val) => (acc += Number(val.cgst_amount)), 0);
    this.numberInWords = numberToWordsWithDecimal(Number(amount));
    return amount.toFixed(2);
  }
  getsgstAmount() {
    let amount = 0;
    amount = this.child.reduce((acc, val) => (acc += Number(val.sgst_amount)), 0);
    this.numberInWords = numberToWordsWithDecimal(Number(amount));
    return amount.toFixed(2);
  }
  getigstAmount() {
    let amount = 0;
    amount = this.child.reduce((acc, val) => (acc += Number(val.igst_amount)), 0);
    this.numberInWords = numberToWordsWithDecimal(Number(amount));
    return amount.toFixed(2);
  }

  getTotalGSTAmount() {
    let amount = 0;
    amount = this.child.reduce((acc, val) => (acc += (Number(val.cgst_amount) + Number(val.sgst_amount) + Number(val.igst_amount))), 0);
    this.numberInWords = numberToWordsWithDecimal(Number(amount));
    return amount.toFixed(2);
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
