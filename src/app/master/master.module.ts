import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../shared/material.module';
import { RouterModule } from '@angular/router';
import { masterRoutes } from './master.routes';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CustomerMasterComponent } from './customer-master/customer-master.component';
import { SupplierMasterComponent } from './supplier-master/supplier-master.component';
import { WeaverMasterComponent } from './weaver-master/weaver-master.component';
import { FinancialYearComponent } from './financial-year/financial-year.component';
import { ThirdPartyMasterComponent } from './third-party-master/third-party-master.component';
import { LoadingspinnerComponent } from './loadingspinner/loadingspinner.component';
import { CaptchaDialogComponent } from './captcha-dialog/captcha-dialog.component';
import { ExpenseMasterComponent } from './expense-master/expense-master.component';
import { HandCashEntryComponent } from './hand-cash-entry/hand-cash-entry.component';
import { BankMasterComponent } from './bank-master/bank-master.component';

@NgModule({
  declarations: [CustomerMasterComponent,
    ConfirmDialogComponent, SupplierMasterComponent, SupplierMasterComponent, WeaverMasterComponent,
    FinancialYearComponent, ThirdPartyMasterComponent, CaptchaDialogComponent, ExpenseMasterComponent,
    HandCashEntryComponent,BankMasterComponent],
  imports: [
    RouterModule.forChild(masterRoutes),
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    HttpClientModule,
    LoadingspinnerComponent
  ]
})
export class MasterModule { }
