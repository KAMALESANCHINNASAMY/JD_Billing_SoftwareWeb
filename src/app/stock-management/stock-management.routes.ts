import { Routes } from "@angular/router";
import { StockManagementComponent } from "./stock-management/stock-management.component";
import { AddressPrintComponent } from "./address-print/address-print.component";
import { RawProductStockComponent } from "./raw-product-stock/raw-product-stock.component";
import { SaleProductStockComponent } from "./sale-product-stock/sale-product-stock.component";

export const stockManageMentRoutes: Routes = [
  { path: 'stock-management', component: StockManagementComponent },
  { path: 'address_print', component: AddressPrintComponent },
  { path: 'raw-product-stock', component: RawProductStockComponent },
  { path: 'sale-product-stock', component: SaleProductStockComponent }
]
