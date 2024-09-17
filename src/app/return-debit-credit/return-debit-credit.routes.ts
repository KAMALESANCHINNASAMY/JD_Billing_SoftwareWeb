import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { SalesBillEntrygstDebitnoteComponent } from './sales-bill-entrygst-debitnote/sales-bill-entrygst-debitnote.component';
import { SalesBillEntryDebitnoteComponent } from './sales-bill-entry-debitnote/sales-bill-entry-debitnote.component';

export const returnDebitCreditRoutes: Routes = [
  {
path:'salesbill-debitgst',component:SalesBillEntrygstDebitnoteComponent
},
{
  path:'salesbill-debitnongst',component:SalesBillEntryDebitnoteComponent
}
];
