import { Routes } from '@angular/router';
import { CustomerMasterComponent } from './customer-master/customer-master.component';
import { SupplierMasterComponent } from './supplier-master/supplier-master.component';
import { WeaverMasterComponent } from './weaver-master/weaver-master.component';
import { FinancialYearComponent } from './financial-year/financial-year.component';
import { ThirdPartyMasterComponent } from './third-party-master/third-party-master.component';



export const masterRoutes: Routes = [
  {
    path:'customer-master',
    component:CustomerMasterComponent
  },
  {
    path:'supplier-master',
    component:SupplierMasterComponent
  },
  {
    path:'weaver-master',
    component:WeaverMasterComponent
  },
  {
    path:'financial-year',
    component:FinancialYearComponent
  },
  {
    path:'third-party-master',
    component:ThirdPartyMasterComponent
  }
];
