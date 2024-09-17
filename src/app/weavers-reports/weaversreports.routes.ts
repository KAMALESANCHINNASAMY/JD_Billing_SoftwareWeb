import { Routes } from '@angular/router';
import { DateWiseReportComponent } from './date-wise-report/date-wise-report.component';
import { WeversWiseReportComponent } from './wevers-wise-report/wevers-wise-report.component';

export const WeaversReportRoutes: Routes = [
  {
    path: 'date_wise_report',
    component: DateWiseReportComponent
  },
  {
    path: 'weavers_wise_report',
    component: WeversWiseReportComponent
  }
]
