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
import { RawMaterialPurchaseRoutes } from './rawmaterial-purchase-reports.routes';
import { DatewisePurchaseReportsComponent } from './datewise-purchase-reports/datewise-purchase-reports.component';
import { SupplierbillnoWiseComponent } from './supplierbillno-wise/supplierbillno-wise.component';
import { SupplierwiseReportsComponent } from './supplierwise-reports/supplierwise-reports.component';
import { PurchaseReturnReportComponent } from './purchase-return-report/purchase-return-report.component';
import { PurchasePaymentReportsComponent } from './purchase-payment-reports/purchase-payment-reports.component';
import { SupplierPaymentComponent } from './supplier-payment/supplier-payment.component';
import { SupplierLedgerComponent } from './supplier-ledger/supplier-ledger.component';

@NgModule({
  declarations: [
    DatewisePurchaseReportsComponent,
    SupplierbillnoWiseComponent,
    SupplierwiseReportsComponent,
    PurchaseReturnReportComponent,
    PurchasePaymentReportsComponent,
    SupplierPaymentComponent,
    SupplierLedgerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(RawMaterialPurchaseRoutes),
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
export class RawmaterialPurchaseReportsModule { }
