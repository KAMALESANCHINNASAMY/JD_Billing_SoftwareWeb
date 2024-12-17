import { Routes } from "@angular/router";
import { JobWorkOutwardReportComponent } from "./job-work-outward-report/job-work-outward-report.component";
import { JobWorkInwardReportComponent } from "./job-work-inward-report/job-work-inward-report.component";
import { PaymentreportComponent } from "./paymentreport/paymentreport.component";

export const jobHandLingReportRouting: Routes = [
    { path: 'job-handling-outward-report', component: JobWorkOutwardReportComponent },
    { path: 'job-handling-inward-report', component: JobWorkInwardReportComponent },
    { path: 'job-handling-payment-report', component: PaymentreportComponent }
]