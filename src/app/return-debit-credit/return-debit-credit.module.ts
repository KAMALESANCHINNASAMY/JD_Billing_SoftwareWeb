import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../shared/material.module';
import { RouterModule } from '@angular/router';
import { returnDebitCreditRoutes } from './return-debit-credit.routes';
import { HttpClientModule } from '@angular/common/http';
import { SalesBillEntrygstDebitnoteComponent } from './sales-bill-entrygst-debitnote/sales-bill-entrygst-debitnote.component';
import { SalesBillEntryDebitnoteComponent } from './sales-bill-entry-debitnote/sales-bill-entry-debitnote.component';
import { ReturnRawProductComponent } from './return-raw-product/return-raw-product.component';
import { ReturnSalesProductComponent } from './return-sales-product/return-sales-product.component';

@NgModule({
  declarations: [
    SalesBillEntrygstDebitnoteComponent,
    SalesBillEntryDebitnoteComponent,
    ReturnRawProductComponent,
    ReturnSalesProductComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(returnDebitCreditRoutes),
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    HttpClientModule
  ]
})
export class ReturnDebitCreditModule { }
