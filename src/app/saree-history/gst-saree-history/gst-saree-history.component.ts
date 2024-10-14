import { Component, OnInit } from '@angular/core';
import { SareeGstHistory } from 'src/app/api-service/saree-history-reports/gstSareeHistory.service';

@Component({
  selector: 'app-gst-saree-history',
  templateUrl: './gst-saree-history.component.html',
  styleUrl: './gst-saree-history.component.scss',
})
export class GstSareeHistoryComponent implements OnInit {
  companyID: number = Number(localStorage.getItem('companyid'));
  historyOfSaree: any[] = [];
  totalPurchaseQty: string;
  totalPurchaseNetTotal: string;
  totalPurchaseReturnQty: string;
  totalPurchaseReturnNettotal: string;
  totalSalesQty: string;
  soldNettotal: string;
  totalSalesReturnQty: string;
  totalSalesReturnNettotal: string;

  constructor(private SGSTH: SareeGstHistory) { }
  ngOnInit(): void { }

  getSareegstHistorybyref_code(ref_code: any) {
    this.historyOfSaree = [];
    this.SGSTH.getGStSareeHistoryByref_code(this.companyID, ref_code).subscribe(
      (res) => {
        this.historyOfSaree = res;
        this.getTotals();
      }
    );
  }

  getSareegstHistorybysi_code(si_code: any) {
    this.historyOfSaree = [];
    this.SGSTH.getGStSareeHistoryBysi_code(this.companyID, si_code).subscribe(
      (res) => {
        this.historyOfSaree = res;
        this.getTotals();
      }
    );
  }

  getTotals() {
    if (this.historyOfSaree) {
      const totalPurchaseQty = this.historyOfSaree.reduce(
        (acc: any, item: any) => (acc += Number(item.purchase_qty)),
        0
      );
      this.totalPurchaseQty = totalPurchaseQty;
      const totalPurchaseNetTotal = this.historyOfSaree.reduce(
        (acc: any, item: any) => (acc += Number(item.purchase_net_total)),
        0
      );
      this.totalPurchaseNetTotal = totalPurchaseNetTotal;
      const totalPurchaseReturnQty = this.historyOfSaree.reduce(
        (acc: any, item: any) => (acc += Number(item.purchase_return_qty)),
        0
      );
      this.totalPurchaseReturnQty = totalPurchaseReturnQty;
      const totalPurchaseReturnNettotal = this.historyOfSaree.reduce(
        (acc: any, item: any) => (acc += Number(item.purchase_return_nettotal)),
        0
      );
      this.totalPurchaseReturnNettotal = totalPurchaseReturnNettotal;
      const totalSalesQty = this.historyOfSaree.reduce(
        (acc: any, item: any) => (acc += Number(item.sold_qty)),
        0
      );
      this.totalSalesQty = totalSalesQty;
      const soldNettotal = this.historyOfSaree.reduce(
        (acc: any, item: any) => (acc += Number(item.sold_net_total)),
        0
      );
      this.soldNettotal = soldNettotal;
      const totalSalesReturnQty = this.historyOfSaree.reduce(
        (acc: any, item: any) => (acc += Number(item.sales_return_qty)),
        0
      );
      this.totalSalesReturnQty = totalSalesReturnQty;
      const totalSalesReturnNettotal = this.historyOfSaree.reduce(
        (acc: any, item: any) => (acc += Number(item.sales_return_net_total)),
        0
      );
      this.totalSalesReturnNettotal = totalSalesReturnNettotal;
    }
  }
}
