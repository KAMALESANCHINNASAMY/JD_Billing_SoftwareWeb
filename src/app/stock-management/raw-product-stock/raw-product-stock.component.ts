import { Component } from '@angular/core';
import { nestedProductMasterService } from 'src/app/api-service/nestedProductMaster.service';

@Component({
  selector: 'app-raw-product-stock',
  templateUrl: './raw-product-stock.component.html',
  styleUrl: './raw-product-stock.component.scss'
})
export class RawProductStockComponent {
  companyID: number = Number(localStorage.getItem('companyid'));
  NestedProductList: any[] = [];
  ngOnInit() {
    this.getNProductList();
  }

  constructor(private nPSvc: nestedProductMasterService,) { }

  getNProductList() {
    this.nPSvc.getList(this.companyID).subscribe((res) => {
      this.NestedProductList = res;
    })
  }
}
