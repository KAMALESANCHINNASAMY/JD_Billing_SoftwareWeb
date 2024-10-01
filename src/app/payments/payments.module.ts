
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../shared/material.module';
import { RouterModule } from '@angular/router';
import { paymentRoutes } from './payments.routes';
import { HttpClientModule } from '@angular/common/http';
import { ThirdPartyPaymentsComponent } from './third-party-payments/third-party-payments.component';
import { SupplierPaymentsComponent } from './supplier-payments/supplier-payments.component';
import { CustomerPaymentsComponent } from './customer-payments/customer-payments.component';
import { RawProductPaymentComponent } from './raw-product-payment/raw-product-payment.component';

@NgModule({
  declarations: [
    ThirdPartyPaymentsComponent,
    SupplierPaymentsComponent,
    CustomerPaymentsComponent,
    RawProductPaymentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(paymentRoutes),
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    HttpClientModule,

  ]
})
export class PaymentsModule { }
