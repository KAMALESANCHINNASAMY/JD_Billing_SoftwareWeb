import { Routes } from "@angular/router";
import { StockManagementComponent } from "./stock-management/stock-management.component";
import { AddressPrintComponent } from "./address-print/address-print.component";

export const stockManageMentRoutes: Routes = [
  { path: 'stock-management', component: StockManagementComponent },
  { path: 'address_print', component: AddressPrintComponent }
]
