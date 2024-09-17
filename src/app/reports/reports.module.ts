import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SalesBillgstReportsComponent } from './sales-billgst-reports/sales-billgst-reports.component';
import { reportsRoutes } from './reports.routes';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MaterialModule } from '../shared/material.module';
import { NgxPrintModule } from 'ngx-print';
import { MatDialogModule } from '@angular/material/dialog';
import { SalesBillnongstReportsComponent } from './sales-billnongst-reports/sales-billnongst-reports.component';
import { SalesBillgstReturnReportsComponent } from './sales-billgst-return-reports/sales-billgst-return-reports.component';
import { SalesBillnongstReturnReportsComponent } from './sales-billnongst-return-reports/sales-billnongst-return-reports.component';
import { RawMaterialPurchaseReportsComponent } from './raw-material-purchase-reports/raw-material-purchase-reports.component';
import { RawMaterialReturnReportsComponent } from './raw-material-return-reports/raw-material-return-reports.component';
import { ThirdPartyGstpurchaseReportsComponent } from './third-party-gstpurchase-reports/third-party-gstpurchase-reports.component';
import { ThirdPartyNongstPurchaseReportComponent } from './third-party-nongst-purchase-report/third-party-nongst-purchase-report.component';
import { ThirdPartyGstpurReturnReportsComponent } from './third-party-gstpur-return-reports/third-party-gstpur-return-reports.component';
import { ThirdPartyNongstpurReturnReportsComponent } from './third-party-nongstpur-return-reports/third-party-nongstpur-return-reports.component';



@NgModule({
  declarations: [
    SalesBillgstReportsComponent, SalesBillgstReportsComponent,
    SalesBillnongstReportsComponent, SalesBillgstReturnReportsComponent,
    SalesBillnongstReturnReportsComponent, RawMaterialPurchaseReportsComponent,
    RawMaterialReturnReportsComponent, ThirdPartyGstpurchaseReportsComponent, ThirdPartyNongstPurchaseReportComponent,
    ThirdPartyGstpurReturnReportsComponent, ThirdPartyNongstpurReturnReportsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(reportsRoutes),
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
export class ReportsModule { }
