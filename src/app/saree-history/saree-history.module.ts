import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SareeHistoryRoutes } from './saree-history.routes';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPrintModule } from 'ngx-print';
import { MaterialModule } from '../shared/material.module';
import { GstSareeHistoryComponent } from './gst-saree-history/gst-saree-history.component';



@NgModule({
  declarations: [
    GstSareeHistoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(SareeHistoryRoutes),
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
export class SareeHistoryModule { }
