import { Routes } from '@angular/router';
import { SalesProductReportComponent } from './sales-product-report/sales-product-report.component';
import { SalesPaymentReportComponent } from './sales-payment-report/sales-payment-report.component';
import { SalesLedgerComponent } from './sales-ledger/sales-ledger.component';

export const salesproductreportRoutes: Routes = [
    { path: 'sales-product-report', component: SalesProductReportComponent },
    { path: 'sales-payment-report', component: SalesPaymentReportComponent },
    { path: 'sales-ledger', component: SalesLedgerComponent }
];
