import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { rawproductreportRoutes } from './raw-product-reports-routing.module';
import { RawProductStockComponent } from './raw-product-stock/raw-product-stock.component';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HttpClientModule } from '@angular/common/http';
import { NgxPrintModule } from 'ngx-print';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [RawProductStockComponent],
  imports: [
    CommonModule, RouterModule.forChild(rawproductreportRoutes),
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
export class RawProductsReportsModule { }
