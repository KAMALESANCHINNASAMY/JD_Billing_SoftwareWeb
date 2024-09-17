import { SareewisegstCustomerwiseSalesComponent } from './sareewisegst-customerwise-sales/sareewisegst-customerwise-sales.component';
import { Routes } from '@angular/router';
import { DatewiseCollectionComponent } from './datewise-collection/datewise-collection.component';
import { CustomerWiseSalesgstReportsComponent } from './customer-wise-salesgst-reports/customer-wise-salesgst-reports.component';
import { SalesReturngstReportsComponent } from './sales-returngst-reports/sales-returngst-reports.component';
import { SalesGstPaymentReportsComponent } from './sales-gst-payment-reports/sales-gst-payment-reports.component';
import { SalesLedgerComponent } from './sales-ledger/sales-ledger.component';
import { CustomerPaymentComponent } from './customer-payment/customer-payment.component';

export const SalesReportRoutes: Routes = [
  { path: 'datewise', component: DatewiseCollectionComponent },
  { path: 'sareewise-custwise', component: SareewisegstCustomerwiseSalesComponent },
  { path: 'customerwise-gst', component: CustomerWiseSalesgstReportsComponent },
  { path: 'sales-return-gst', component: SalesReturngstReportsComponent },
  { path: 'sales-payment-gst', component: SalesGstPaymentReportsComponent },
  { path: 'sales-ledger', component: SalesLedgerComponent },
  { path: 'customerpayment', component: CustomerPaymentComponent }
];
