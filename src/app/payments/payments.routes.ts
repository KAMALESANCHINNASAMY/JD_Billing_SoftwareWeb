import { Routes } from '@angular/router';
import { ThirdPartyPaymentsComponent } from './third-party-payments/third-party-payments.component';
import { SupplierPaymentsComponent } from './supplier-payments/supplier-payments.component';
import { CustomerPaymentsComponent } from './customer-payments/customer-payments.component';

export const paymentRoutes: Routes = [
  { path: 'third-party-payments', component: ThirdPartyPaymentsComponent },
  { path: 'supplier-payments', component: SupplierPaymentsComponent },
  {path:'customer-payments',component:CustomerPaymentsComponent}
];
