import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { salesproductreportRoutes } from './sales-reports-routing.module';
import { SalesProductReportComponent } from './sales-product-report/sales-product-report.component';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HttpClientModule } from '@angular/common/http';
import { NgxPrintModule } from 'ngx-print';
import { MatDialogModule } from '@angular/material/dialog';
import { SalesPaymentReportComponent } from './sales-payment-report/sales-payment-report.component';
import { SalesLedgerComponent } from './sales-ledger/sales-ledger.component';

@NgModule({
  declarations: [SalesProductReportComponent, SalesPaymentReportComponent, SalesLedgerComponent],
  imports: [
    CommonModule, RouterModule.forChild(salesproductreportRoutes),
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    HttpClientModule,
    NgxPrintModule,
    MatDialogModule
  ],
  providers: [DatePipe]
})
export class SalesProductReportsModule { }
