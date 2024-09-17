import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { stockManageMentRoutes } from './stock-management.routes';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MaterialModule } from '../shared/material.module';
import { StockManagementComponent } from './stock-management/stock-management.component';
import { NgxPrintModule } from 'ngx-print';
import { MatButtonModule } from '@angular/material/button';
import { AddressPrintComponent } from './address-print/address-print.component';


@NgModule({
  declarations: [
    StockManagementComponent,
    AddressPrintComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(stockManageMentRoutes),
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    HttpClientModule,
    NgxPrintModule,
    MatButtonModule
  ]
})
export class StockManagementModule { }
