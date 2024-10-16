import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { productMasterService } from 'src/app/api-service/productMaster.service';
import { salesProductReportService } from 'src/app/api-service/salesProductReport.service';

@Component({
  selector: 'app-sales-product-report',
  templateUrl: './sales-product-report.component.html',
  styleUrl: './sales-product-report.component.scss'
})
export class SalesProductReportComponent {
  purchaseReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  customerDetailsList: any[] = [];
  suggestions: any[] = [];
  productList: any[] = [];

  constructor(private rpSvc: salesProductReportService,
    private pSvc: productMasterService,
    private cMSvc: customerMasterService
  ) { }

  ngOnInit() {
    this.getCustomerList();
    this.getProductList();
  }

  getCustomerList() {
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.customerDetailsList = res;
      this.suggestions = res;
    });
  }

  gstSuggest(value: any) {
    this.suggestions = this.customerDetailsList.filter((item) =>
      item.customer_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.customerDetailsList;
  }

  getProductList() {
    this.pSvc.getList(this.companyID).subscribe((res) => {
      this.productList = res
    })
  }

  reportForm = new FormGroup({
    customerid: new FormControl(null),
    fromdate: new FormControl(''),
    todate: new FormControl('')
  })

  async getReport() {
    const id = this.reportForm.value.customerid;
    const fromdate = this.reportForm.value.fromdate;
    const todate = this.reportForm.value.todate;
    if (this.reportForm.valid) {
      const res = await this.rpSvc.saleList(this.companyID, id, fromdate, todate).toPromise();
      this.purchaseReports = res || [];
    }
    else {
      this.reportForm.markAllAsTouched();
    }
  }

  getQty(productid: number, value: any) {
    let reval: number = 0;
    let productids: any[] = value.productids.split(',').map((id: string) => Number(id));
    let qtys: any[] = value.qtys.split(',');
    let index = productids.indexOf(productid);
    if (index !== -1 && productids.length === qtys.length) {
      reval = Number(qtys[index] || 0);
    }

    return Number(reval);
  }

  getNetTot(id: number) {
    let reval: number = 0;
    this.purchaseReports.forEach((value) => {
      let newval = 0;
      let productids: any[] = value.productids.split(',').map((id: string) => Number(id));
      let qtys: any[] = value.qtys.split(',');
      let index = productids.indexOf(id);
      if (index !== -1 && productids.length === qtys.length) {
        newval = Number(qtys[index] || 0);
      }
      reval = reval + newval;
    });

    return Number(reval);
  }
}
