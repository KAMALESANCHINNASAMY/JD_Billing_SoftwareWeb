import { Component } from '@angular/core';
import { RawMatPurchaseReportsService } from 'src/app/api-service/rawmatPurchase-reports/rawMatPurchase-reports.service';
import { SupplierMasterService } from 'src/app/api-service/supplierMaster.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
@Component({
  selector: 'app-datewise-purchase-reports',
  templateUrl: './datewise-purchase-reports.component.html',
  styleUrl: './datewise-purchase-reports.component.scss',
  providers: [DatePipe]
})
export class DatewisePurchaseReportsComponent {
  supplierDetailsList: any[] = [];
  purchaseReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];

  constructor(private RMPRSVC: RawMatPurchaseReportsService, private sMSvc: SupplierMasterService,
    private notificationSvc: NotificationsService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.getSupplierList();
  }

  reportForm = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    supplierid: new FormControl(null)
  });

  async getReport() {
    if (this.reportForm.valid) {
      const fromDate = this.reportForm.value.fromdate;
      const toDate = this.reportForm.value.todate;
      const SupID = this.reportForm.value.supplierid;
      let res = await this.RMPRSVC.getRawMatPurchaseFromToDate(fromDate, toDate, SupID, this.companyID).toPromise();
      this.purchaseReports = res || [];
    }
    else {
      this.notificationSvc.error('Please enter the required fields !');
    }
  }

  getSupplierList() {
    this.sMSvc.getList(this.companyID).subscribe((res: any) => {
      this.supplierDetailsList = res;
      this.suggestions = res;
    });
  }

  suggest(value: any) {
    this.suggestions = this.supplierDetailsList.filter((item) =>
      item.supplier_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1) this.suggestions = this.supplierDetailsList;
  }

  gettotalQty() {
    let qty = 0;
    qty = this.purchaseReports.reduce((acc: any, item: any) => (acc += Number(item.qty)), 0);
    return qty;
  }

  gettotalnettotal() {
    let net_total = 0;
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
