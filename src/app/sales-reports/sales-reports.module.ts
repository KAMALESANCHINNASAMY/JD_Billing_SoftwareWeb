import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesReportRoutes } from './sales-reports.routes';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MaterialModule } from '../shared/material.module';
import { NgxPrintModule } from 'ngx-print';
import { MatDialogModule } from '@angular/material/dialog';
import { DatewiseCollectionComponent } from './datewise-collection/datewise-collection.component';
import { DatewiseNongstCollectionComponent } from './datewise-nongst-collection/datewise-nongst-collection.component';
import { SareewisegstCustomerwiseSalesComponent } from './sareewisegst-customerwise-sales/sareewisegst-customerwise-sales.component';
import { SareewiseNongstCustomerwiseSalesComponent } from './sareewise-nongst-customerwise-sales/sareewise-nongst-customerwise-sales.component';
import { CustomerWiseSalesgstReportsComponent } from './customer-wise-salesgst-reports/customer-wise-salesgst-reports.component';
import { CustomerWiseSalesNongstReportsComponent } from './customer-wise-sales-nongst-reports/customer-wise-sales-nongst-reports.component';
import { SalesReturngstReportsComponent } from './sales-returngst-reports/sales-returngst-reports.component';
import { SalesReturnNongstReportsComponent } from './sales-return-nongst-reports/sales-return-nongst-reports.component';
import { SalesGstPaymentReportsComponent } from './sales-gst-payment-reports/sales-gst-payment-reports.component';
import { SalesNongstPaymentReportsComponent } from './sales-nongst-payment-reports/sales-nongst-payment-reports.component';
import { SalesLedgerComponent } from './sales-ledger/sales-ledger.component';
import { SalesLedgerNongstComponent } from './sales-ledger-nongst/sales-ledger-nongst.component';
import { CustomerPaymentComponent } from './customer-payment/customer-payment.component';

@NgModule({
  declarations: [
    DatewiseCollectionComponent,
    DatewiseNongstCollectionComponent,
    SareewisegstCustomerwiseSalesComponent,
    SareewiseNongstCustomerwiseSalesComponent,
    CustomerWiseSalesgstReportsComponent,
    CustomerWiseSalesNongstReportsComponent,
    SalesReturngstReportsComponent,
    SalesReturnNongstReportsComponent,
    SalesGstPaymentReportsComponent,
    SalesNongstPaymentReportsComponent,
    SalesLedgerComponent,
    SalesLedgerNongstComponent,
    CustomerPaymentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(SalesReportRoutes),
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
export class SalesReportsModule { }
