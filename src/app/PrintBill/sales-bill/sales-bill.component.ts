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
  async ngOnInit() {
    await this.getCompanyDetails();
    this.parent = this.data.parent;
    this.child = this.data.child;
    this.getCustomerList();

    console.log(this.child)
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

  getFormattedDate(dateString: string): string | null {
    if (dateString) {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'dd-MM-yyyy');
    } else {
      return '';
    }
  }

}
