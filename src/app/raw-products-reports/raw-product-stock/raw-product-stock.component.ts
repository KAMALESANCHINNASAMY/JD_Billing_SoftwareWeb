import { Component } from '@angular/core';
import { rawProductReportService } from 'src/app/api-service/raw_product_report.serivce';

@Component({
  selector: 'app-raw-product-stock',
  templateUrl: './raw-product-stock.component.html',
  styleUrl: './raw-product-stock.component.scss'
})
export class RawProductStockComponent {
  purchaseReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));

  constructor(private rpSvc: rawProductReportService
  ) { }

  ngOnInit() {
    this.getReport();
  }

  async getReport() {
    const res = await this.rpSvc.getRawProductStockList(this.companyID).toPromise();
    this.purchaseReports = res || [];
  }
}
