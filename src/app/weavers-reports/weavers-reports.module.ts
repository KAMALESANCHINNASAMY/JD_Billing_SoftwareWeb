import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WeaversReportRoutes } from './weaversreports.routes';
import { DateWiseReportComponent } from './date-wise-report/date-wise-report.component';
import { WeversWiseReportComponent } from './wevers-wise-report/wevers-wise-report.component';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HttpClientModule } from '@angular/common/http';
import { NgxPrintModule } from 'ngx-print';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [DateWiseReportComponent, WeversWiseReportComponent],
  imports: [
    CommonModule, RouterModule.forChild(WeaversReportRoutes),
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
export class WeaversReportsModule { }
