import { Component } from '@angular/core';
import { salesProductReportService } from 'src/app/api-service/salesProductReport.service';

@Component({
  selector: 'app-sales-product-report',
  templateUrl: './sales-product-report.component.html',
  styleUrl: './sales-product-report.component.scss'
})
export class SalesProductReportComponent {
  purchaseReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));

  constructor(private rpSvc: salesProductReportService
  ) { }

  ngOnInit() {
    this.getReport();
  }

  async getReport() {
    const res = await this.rpSvc.saleRawProductList(this.companyID).toPromise();
    this.purchaseReports = res || [];
  }
}
