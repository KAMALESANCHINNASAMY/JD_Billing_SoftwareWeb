import { Component, OnInit } from '@angular/core';
import { RawMatPurchaseReportsService } from 'src/app/api-service/rawmatPurchase-reports/rawMatPurchase-reports.service';
import { SupplierMasterService } from 'src/app/api-service/supplierMaster.service';
import { DatePipe } from '@angular/common';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-supplierwise-reports',
  templateUrl: './supplierwise-reports.component.html',
  styleUrl: './supplierwise-reports.component.scss',
  providers: [DatePipe]
})
export class SupplierwiseReportsComponent implements OnInit {
  purchaseReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  supplierDetailsList: any[] = [];
  suggestions: any[] = [];

  constructor(private RMPRSVC: RawMatPurchaseReportsService,
    private sMSvc: SupplierMasterService,
    private datePipe: DatePipe,
    private notificationSvc: NotificationsService,
  ) { }

  ngOnInit() {
    this.getSupplierList();
  }

  getSupplierList() {
    this.sMSvc.getList(this.companyID).subscribe((res: any) => {
      this.supplierDetailsList = res;
      this.suggestions = res;
    });
  }

  getRawMatPurReportBySupplierid(supplierid: any) {
    if (supplierid >= 0) {
      this.RMPRSVC.getRawMatPurchaseBySupplier(supplierid, this.companyID).subscribe((res) => {
        this.purchaseReports = res;
      });
    }
    else {
      this.notificationSvc.error('Please enter the required fields !');
    }
  }

  suggest(value: any) {
    this.suggestions = this.supplierDetailsList.filter((item) =>
      item.supplier_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1) this.suggestions = this.supplierDetailsList;
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
