import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MaterialModule } from '../shared/material.module';
import { NgxPrintModule } from 'ngx-print';
import { MatDialogModule } from '@angular/material/dialog';
import { ThirdPartyReportsRoutes } from './third-party-reports.routes';
import { DatewiseGstpurchaseReportsComponent } from './datewise-gstpurchase-reports/datewise-gstpurchase-reports.component';
import { DatewiseNongstpurchaseReportsComponent } from './datewise-nongstpurchase-reports/datewise-nongstpurchase-reports.component';
import { SareeWiseGstReportsComponent } from './saree-wise-gst-reports/saree-wise-gst-reports.component';
import { SareeWiseNongstReportsComponent } from './saree-wise-nongst-reports/saree-wise-nongst-reports.component';
import { PartyWisegstReportsComponent } from './party-wisegst-reports/party-wisegst-reports.component';
import { PartyWiseNongstpurchaseReportsComponent } from './party-wise-nongstpurchase-reports/party-wise-nongstpurchase-reports.component';
import { PurchaseReturngstReturnComponent } from './purchase-returngst-return/purchase-returngst-return.component';
import { PurchaseReturnNongstReturnComponent } from './purchase-return-nongst-return/purchase-return-nongst-return.component';
import { ThirdPartygstPaymentsReportComponent } from './third-partygst-payments-report/third-partygst-payments-report.component';
import { ThirdPartyNongstPaymentsReportComponent } from './third-party-nongst-payments-report/third-party-nongst-payments-report.component';
import { ThirdPartyPaymentComponent } from './third-party-payment/third-party-payment.component';
import { ThirdPartyGstLedgerComponent } from './third-party-gst-ledger/third-party-gst-ledger.component';
import { ThirdPartyNongstLedgerComponent } from './third-party-nongst-ledger/third-party-nongst-ledger.component';



@NgModule({
  declarations: [
    DatewiseGstpurchaseReportsComponent,
    DatewiseNongstpurchaseReportsComponent,
    SareeWiseGstReportsComponent,
    SareeWiseNongstReportsComponent,
    PartyWisegstReportsComponent,
    PartyWiseNongstpurchaseReportsComponent,
    PurchaseReturngstReturnComponent,
    PurchaseReturnNongstReturnComponent,
    ThirdPartygstPaymentsReportComponent,
    ThirdPartyNongstPaymentsReportComponent,
    ThirdPartyPaymentComponent,
    ThirdPartyGstLedgerComponent,
    ThirdPartyNongstLedgerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ThirdPartyReportsRoutes),
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    HttpClientModule,
    NgxPrintModule,
    MatDialogModule
  ]
})
export class ThirdPartyReportsModule { }
