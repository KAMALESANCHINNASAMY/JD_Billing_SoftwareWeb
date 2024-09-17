import { SupplierDebitNoteService } from './../../api-service/Accounts/supplierDebitNote.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-supplierbillno-wise',
  templateUrl: './supplierbillno-wise.component.html',
  styleUrl: './supplierbillno-wise.component.scss',
  providers: [DatePipe]
})
export class SupplierbillnoWiseComponent implements OnInit {

  purchaseReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));

  constructor(
    private SBNSVC: SupplierDebitNoteService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() { }

  getRawMaterialPurchasebysupplierbno(supbillno: any) {
    this.SBNSVC.getRawmatPBySupbno(this.companyID, supbillno).subscribe((res) => {
      this.purchaseReports = res;
    });
  }

  totalQty() {
    let total_Qty = 0
    total_Qty = this.purchaseReports.reduce((acc: any, item: any) => (acc += Number(item.qty)), 0);
    return total_Qty;
  }

  total_nettotal() {
    let net_total = 0
    net_total = this.purchaseReports.reduce((acc: any, item: any) => (acc += Number(item.net_total)), 0);
    return net_total;
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
