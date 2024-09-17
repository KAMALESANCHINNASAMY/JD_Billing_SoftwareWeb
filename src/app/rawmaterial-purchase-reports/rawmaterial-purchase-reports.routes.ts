import { Routes } from '@angular/router';
import { DatewisePurchaseReportsComponent } from './datewise-purchase-reports/datewise-purchase-reports.component';
import { SupplierbillnoWiseComponent } from './supplierbillno-wise/supplierbillno-wise.component';
import { SupplierwiseReportsComponent } from './supplierwise-reports/supplierwise-reports.component';
import { PurchaseReturnReportComponent } from './purchase-return-report/purchase-return-report.component';
import { PurchasePaymentReportsComponent } from './purchase-payment-reports/purchase-payment-reports.component';
import { SupplierPaymentComponent } from './supplier-payment/supplier-payment.component';
import { SupplierLedgerComponent } from './supplier-ledger/supplier-ledger.component';

export const RawMaterialPurchaseRoutes: Routes = [
  { path: 'datewise-rawpurchase', component: DatewisePurchaseReportsComponent },
  { path: 'suppbillno-rawpurchase', component: SupplierbillnoWiseComponent },
  { path: 'supplierwise-rawpurchase', component: SupplierwiseReportsComponent },
  { path: 'purchasereturn-rawpurchase', component: PurchaseReturnReportComponent },
  { path: 'purchasepayment-rawpurchase', component: PurchasePaymentReportsComponent },
  { path: 'supplierpayment', component: SupplierPaymentComponent },
  { path: 'supplierledger', component: SupplierLedgerComponent }
];
