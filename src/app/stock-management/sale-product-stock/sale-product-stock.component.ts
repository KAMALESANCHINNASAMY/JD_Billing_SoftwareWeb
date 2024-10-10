import { Component } from '@angular/core';
import { productMasterService } from 'src/app/api-service/productMaster.service';

@Component({
  selector: 'app-sale-product-stock',
  templateUrl: './sale-product-stock.component.html',
  styleUrl: './sale-product-stock.component.scss'
})
export class SaleProductStockComponent {
  companyID: number = Number(localStorage.getItem('companyid'));
  productList: any[] = [];
  ngOnInit() {
    this.getProductList();
  }

  constructor(private pSvc: productMasterService,) { }

  getProductList() {
    this.pSvc.getList(this.companyID).subscribe((res) => {
      this.productList = res;
      console.log(res)
    })
  }
}
