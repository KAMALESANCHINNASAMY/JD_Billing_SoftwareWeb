import { Routes } from '@angular/router';
import { DatewiseGstpurchaseReportsComponent } from './datewise-gstpurchase-reports/datewise-gstpurchase-reports.component';
import { SareeWiseGstReportsComponent } from './saree-wise-gst-reports/saree-wise-gst-reports.component';
import { PartyWisegstReportsComponent } from './party-wisegst-reports/party-wisegst-reports.component';
import { PurchaseReturngstReturnComponent } from './purchase-returngst-return/purchase-returngst-return.component';
import { ThirdPartygstPaymentsReportComponent } from './third-partygst-payments-report/third-partygst-payments-report.component';
import { ThirdPartyPaymentComponent } from './third-party-payment/third-party-payment.component';
import { ThirdPartyGstLedgerComponent } from './third-party-gst-ledger/third-party-gst-ledger.component';

export const ThirdPartyReportsRoutes: Routes = [
  { path: 'datewisegst-reports', component: DatewiseGstpurchaseReportsComponent },
  { path: 'sareewisegst-reports', component: SareeWiseGstReportsComponent },
  { path: 'party-wisegst-reports', component: PartyWisegstReportsComponent },
  { path: 'purchase-return-reports', component: PurchaseReturngstReturnComponent },
  { path: 'thirdprty-payment-reports', component: ThirdPartygstPaymentsReportComponent },
  { path: 'thirdprty-payment', component: ThirdPartyPaymentComponent },
  { path: 'thirdprty-gst-ledger', component: ThirdPartyGstLedgerComponent }
];
