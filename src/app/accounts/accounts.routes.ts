import { ThirdPartySareesGstDebitNoteComponent } from './third-party-sarees-gst-debit-note/third-party-sarees-gst-debit-note.component';
import { Routes } from '@angular/router';
import { RawMaterialPurchaseComponent } from './raw-material-purchase/raw-material-purchase.component';
import { SalesBillEntryComponent } from './sales-bill-entry/sales-bill-entry.component';
import { ThirdPartySareesgstPurchaseComponent } from './third-party-sareesgst-purchase/third-party-sareesgst-purchase.component';
import { ThirdPartySareesComponent } from './third-party-sarees/third-party-sarees.component';
import { WeaversSareesComponent } from './weavers-sarees/weavers-sarees.component';
import { MultipleSalesBillentryGSTComponent } from './multiple-sales-billentry-gst/multiple-sales-billentry-gst.component';
import { MultipleSalesBillentryComponent } from './multiple-sales-billentry/multiple-sales-billentry.component';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { ThirdPartySareesDebitNoteComponent } from './third-party-sarees-debit-note/third-party-sarees-debit-note.component';
import { WeaversWithGivenReceivedComponent } from './weavers-with-given-received/weavers-with-given-received.component';

export const accountsRoutes: Routes = [
  {
    path: 'raw-material',
    component: RawMaterialPurchaseComponent,
  },
  {
    path: 'salesbill-entry',
    component: SalesBillEntryComponent,
  },
  {
    path: 'thirdparty-sareegst',
    component: ThirdPartySareesgstPurchaseComponent,
  },
  {
    path: 'thirdparty-sarees',
    component: ThirdPartySareesComponent
  },
  {
    path: 'weavers-sarees',
    component: WeaversSareesComponent
  }, {
    path: 'multiple-sales-withGST',
    component: MultipleSalesBillentryGSTComponent
  }, {
    path: 'multiple-sales-withoutGST',
    component: MultipleSalesBillentryComponent
  }, {
    path: 'debit-note',
    component: DebitNoteComponent
  }, {
    path: 'third-partygst-debit-note',
    component: ThirdPartySareesGstDebitNoteComponent
  },
  {
    path: 'third-party-debit-note',
    component: ThirdPartySareesDebitNoteComponent
  },
  {
    path: 'weavers_with_given_recived',
    component: WeaversWithGivenReceivedComponent
  }
];
