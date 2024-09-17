import { ItemMasterComponent } from './item-master/item-master.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../shared/material.module';
import { RouterModule } from '@angular/router';
import { inventoryroutes } from './inventory.routes';
import { HttpClientModule } from '@angular/common/http';
import { UnitMasterComponent } from './unit-master/unit-master.component';
import { GstMasterComponent } from './gst-master/gst-master.component';
import { HsnGroupComponent } from './hsn-group/hsn-group.component';
import { ItemGroupComponent } from './item-group/item-group.component';
import { BrandMasterComponent } from './brand-master/brand-master.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProductMasterComponent } from './product-master/product-master.component';

@NgModule({
  declarations: [ItemMasterComponent,
    UnitMasterComponent,
    GstMasterComponent,
    HsnGroupComponent,
    ItemGroupComponent,
    BrandMasterComponent,
    ProductMasterComponent
  ],
  imports: [
    RouterModule.forChild(inventoryroutes),
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    HttpClientModule,
    ZXingScannerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InventoryModule { }
