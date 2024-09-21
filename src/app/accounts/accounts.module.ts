import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../shared/material.module';
import { RouterModule } from '@angular/router';
import { accountsRoutes } from './accounts.routes'
import { HttpClientModule } from '@angular/common/http';
import { RawMaterialPurchaseComponent } from './raw-material-purchase/raw-material-purchase.component';
import { SalesBillEntryComponent } from './sales-bill-entry/sales-bill-entry.component';
import { ThirdPartySareesgstPurchaseComponent } from './third-party-sareesgst-purchase/third-party-sareesgst-purchase.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WeaversSareesComponent } from './weavers-sarees/weavers-sarees.component';
import { ThirdPartySareesComponent } from './third-party-sarees/third-party-sarees.component';
import { SalesBillEntryNonGstComponent } from './sales-bill-entry-non-gst/sales-bill-entry-non-gst.component';
import { MultipleSalesBillentryGSTComponent } from './multiple-sales-billentry-gst/multiple-sales-billentry-gst.component';
import { MultipleSalesBillentryComponent } from './multiple-sales-billentry/multiple-sales-billentry.component';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { ThirdPartySareesDebitNoteComponent } from './third-party-sarees-debit-note/third-party-sarees-debit-note.component';
import { ThirdPartySareesGstDebitNoteComponent } from './third-party-sarees-gst-debit-note/third-party-sarees-gst-debit-note.component';
import { WeaversWithGivenReceivedComponent } from './weavers-with-given-received/weavers-with-given-received.component';
import { RawProductPurchaseComponent } from './raw-product-purchase/raw-product-purchase.component';
import { SalesProductComponent } from './sales-product/sales-product.component';


@NgModule({
  declarations: [
    RawMaterialPurchaseComponent,
    SalesBillEntryComponent,
    ThirdPartySareesgstPurchaseComponent,
    WeaversSareesComponent,
    ThirdPartySareesComponent,
    SalesBillEntryNonGstComponent,
    MultipleSalesBillentryGSTComponent,
    MultipleSalesBillentryComponent,
    DebitNoteComponent,
    ThirdPartySareesDebitNoteComponent,
    ThirdPartySareesGstDebitNoteComponent,
    WeaversWithGivenReceivedComponent,
    RawProductPurchaseComponent,
    SalesProductComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(accountsRoutes),
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    HttpClientModule, MatCardModule, MatIconModule, MatAutocompleteModule, MatSelectModule, MatFormFieldModule, MatInputModule
  ]
})
export class AccountsModule { }
