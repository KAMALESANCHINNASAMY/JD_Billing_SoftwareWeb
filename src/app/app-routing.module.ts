import { ReturnDebitCreditModule } from './return-debit-credit/return-debit-credit.module';
import { ConfirmDialogComponent } from './master/confirm-dialog/confirm-dialog.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './shared/components/login-component/login-component.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './gurd/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dialog', component: ConfirmDialogComponent },
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'accounts',
        loadChildren: () =>
          import('./accounts/accounts.module').then((m) => m.AccountsModule),
      },
      {
        path: 'returnCredit-Debit',
        loadChildren: () =>
          import('./return-debit-credit/return-debit-credit.module').then((m) => m.ReturnDebitCreditModule)
      },
      {
        path: 'company',
        loadChildren: () =>
          import('./company/company.module').then((m) => m.CompanyModule),
      },
      {
        path: 'master',
        loadChildren: () =>
          import('./master/master.module').then((m) => m.MasterModule),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./inventory/inventory.module').then((m) => m.InventoryModule),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('./payments/payments.module').then((m) => m.PaymentsModule)
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule)
      }, {
        path: 'stocks',
        loadChildren: () =>
          import('./stock-management/stock-management.module').then((m) => m.StockManagementModule)
      },
      {
        path: 'third-party-reports',
        loadChildren: () =>
          import('./third-party-reports/third-party-reports.module').then((m) => (m.ThirdPartyReportsModule))
      },
      {
        path: 'sales-report',
        loadChildren: () =>
          import('./sales-reports/sales-reports.module').then((m) => m.SalesReportsModule)
      },
      {
        path: 'rawmaterialpurchase-report',
        loadChildren: () =>
          import('./rawmaterial-purchase-reports/rawmaterial-purchase-reports.module').then((m) => m.RawmaterialPurchaseReportsModule)
      },
      {
        path: 'weaversreports',
        loadChildren: () =>
          import('./weavers-reports/weavers-reports.module').then((m) => m.WeaversReportsModule)
      },
      {
        path: 'saree-history',
        loadChildren: () =>
          import('./saree-history/saree-history.module').then((m) => (m.SareeHistoryModule))
      },
      {
        path: 'sales-products-reports',
        loadChildren: () =>
          import('./sales-product-reports/sales-product-reports.module').then((m) => (m.SalesProductReportsModule))
      },
      {
        path: 'raw-products-reports',
        loadChildren: () =>
          import('./raw-products-reports/raw-products-reports.module').then((m) => (m.RawProductsReportsModule))
      },
      {
        path: 'day-book',
        loadChildren: () =>
          import('./day-book/day-book.module').then((m) => (m.DayBookModule))
      }
    ],
  },
];

export const pageComponents = [LoginComponent, LayoutComponent];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
