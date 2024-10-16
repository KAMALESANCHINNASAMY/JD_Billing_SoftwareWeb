import { Routes } from '@angular/router';
import { RawProductStockComponent } from './raw-product-stock/raw-product-stock.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';
import { SupplierLedgerComponent } from './supplier-ledger/supplier-ledger.component';

export const rawproductreportRoutes: Routes = [
    { path: 'raw-product-stock', component: RawProductStockComponent },
    { path: 'raw-product-payment-report', component: PaymentReportComponent },
    { path: 'supplier-ledger', component: SupplierLedgerComponent }
];
