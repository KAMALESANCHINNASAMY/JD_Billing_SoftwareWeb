import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { jobHandLingReportRouting } from './job-handling-report-routing.module';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HttpClientModule } from '@angular/common/http';
import { NgxPrintModule } from 'ngx-print';
import { MatDialogModule } from '@angular/material/dialog';
import { JobWorkInwardReportComponent } from './job-work-inward-report/job-work-inward-report.component';
import { JobWorkOutwardReportComponent } from './job-work-outward-report/job-work-outward-report.component';
import { PaymentreportComponent } from './paymentreport/paymentreport.component';



@NgModule({
  declarations: [JobWorkInwardReportComponent, JobWorkOutwardReportComponent, PaymentreportComponent],
  imports: [
    CommonModule, RouterModule.forChild(jobHandLingReportRouting),
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
export class JobHandlingReportModule { }
