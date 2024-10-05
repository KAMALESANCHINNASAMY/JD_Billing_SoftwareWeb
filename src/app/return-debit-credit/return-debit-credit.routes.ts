import { Routes } from '@angular/router';
import { SalesBillEntrygstDebitnoteComponent } from './sales-bill-entrygst-debitnote/sales-bill-entrygst-debitnote.component';
import { SalesBillEntryDebitnoteComponent } from './sales-bill-entry-debitnote/sales-bill-entry-debitnote.component';
import { ReturnRawProductComponent } from './return-raw-product/return-raw-product.component';
import { ReturnSalesProductComponent } from './return-sales-product/return-sales-product.component';
import { ThirdPartySupplyReturnComponent } from './third-party-supply-return/third-party-supply-return.component';
import { ThirdPartyPurchaseReturnComponent } from './third-party-purchase-return/third-party-purchase-return.component';

export const returnDebitCreditRoutes: Routes = [
  {
    path: 'salesbill-debitgst',
    component: SalesBillEntrygstDebitnoteComponent
  },
  {
    path: 'salesbill-debitnongst',
    component: SalesBillEntryDebitnoteComponent
  },
  {
    path: 'return-raw-prodcut',
    component: ReturnRawProductComponent
  },
  {
    path: 'return-sales-product',
    component: ReturnSalesProductComponent
  },
  {
    path: 'thirdParty-supply-return',
    component: ThirdPartySupplyReturnComponent
  },
  {
    path: 'thirdParty-purchase-return',
    component: ThirdPartyPurchaseReturnComponent
  }
];
