import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { nestedProductMasterService } from 'src/app/api-service/nestedProductMaster.service';
import { rawProductReportService } from 'src/app/api-service/raw_product_report.serivce';
import { SupplierMasterService } from 'src/app/api-service/supplierMaster.service';

@Component({
  selector: 'app-raw-product-stock',
  templateUrl: './raw-product-stock.component.html',
  styleUrl: './raw-product-stock.component.scss'
})
export class RawProductStockComponent {
  purchaseReports: any[] = [];
  companyID: number = Number(localStorage.getItem('companyid'));
  supplierDetailsList: any[] = [];
  suggestions: any[] = [];
  NestedProductList: any[] = [];

  constructor(private rpSvc: rawProductReportService,
    private sMSvc: SupplierMasterService,
    private nPSvc: nestedProductMasterService
  ) { }

  ngOnInit() {
    this.getSupplierList();
    this.getNProductList();
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
    if (this.suggestions.length < 1)
      this.suggestions = this.supplierDetailsList;
  }
  getNProductList() {
    this.nPSvc.getList(this.companyID).subscribe((res) => {
      this.NestedProductList = res
    })
  }

  reportForm = new FormGroup({
    supplierid: new FormControl(null),
    fromdate: new FormControl(''),
    todate: new FormControl('')
  })

  async getReport() {
    const id = this.reportForm.value.supplierid;
    const fromdate = this.reportForm.value.fromdate;
    const todate = this.reportForm.value.todate;
    if (this.reportForm.valid) {
      const res = await this.rpSvc.getRawProductStockList(this.companyID, id, fromdate, todate).toPromise();
      this.purchaseReports = res || [];
    }
    else {
      this.reportForm.markAllAsTouched();
    }
  }

  getQty(n_productid: number, value: any) {
    let reval: number = 0;
    let productids: any[] = value.n_productids.split(',').map((id: string) => Number(id));
    let qtys: any[] = value.qtys.split(',');
    let index = productids.indexOf(n_productid);
    if (index !== -1 && productids.length === qtys.length) {
      reval = Number(qtys[index] || 0);
    }

    return Number(reval);
  }

  getNetTot(id: number) {
    let reval: number = 0;
    this.purchaseReports.forEach((value) => {
      let newval = 0;
      let productids: any[] = value.n_productids.split(',').map((id: string) => Number(id));
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
