import { Routes } from '@angular/router';
import { ThirdPartyPaymentsComponent } from './third-party-payments/third-party-payments.component';
import { SupplierPaymentsComponent } from './supplier-payments/supplier-payments.component';
import { CustomerPaymentsComponent } from './customer-payments/customer-payments.component';
import { RawProductPaymentComponent } from './raw-product-payment/raw-product-payment.component';
import { ThirdPartyPurchasePaymentComponent } from './third-party-purchase-payment/third-party-purchase-payment.component';
import { SaleProductsPaymentComponent } from './sale-products-payment/sale-products-payment.component';

export const paymentRoutes: Routes = [
  { path: 'third-party-payments', component: ThirdPartyPaymentsComponent },
  { path: 'supplier-payments', component: SupplierPaymentsComponent },
  { path: 'customer-payments', component: CustomerPaymentsComponent },
  { path: 'raw-product-payment', component: RawProductPaymentComponent },
  { path: 'third-party-purchase-payment', component: ThirdPartyPurchasePaymentComponent },
  { path: 'sale-product-payment', component: SaleProductsPaymentComponent }
];
