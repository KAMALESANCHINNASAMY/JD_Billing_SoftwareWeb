import { Routes } from '@angular/router';
import { ItemMasterComponent } from './item-master/item-master.component';
import { UnitMasterComponent } from './unit-master/unit-master.component';
import { GstMasterComponent } from './gst-master/gst-master.component';
import { HsnGroupComponent } from './hsn-group/hsn-group.component';
import { ItemGroupComponent } from './item-group/item-group.component';
import { BrandMasterComponent } from './brand-master/brand-master.component';
import { ProductMasterComponent } from './product-master/product-master.component';

export const inventoryroutes: Routes = [
  {
    path: 'item-master',
    component: ItemMasterComponent,
  },
  {
    path: 'gst-master',
    component: GstMasterComponent,
  },
  {
    path: 'unit-master',
    component: UnitMasterComponent,
  },
  {
    path: 'hsn-group',
    component: HsnGroupComponent
  },
  {
    path: 'brand-master',
    component: BrandMasterComponent
  },
  {
    path: 'item-group',
    component: ItemGroupComponent
  },
  {
    path: 'product-master',
    component: ProductMasterComponent
  }
];
