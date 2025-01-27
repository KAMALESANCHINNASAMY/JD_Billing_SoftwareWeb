import { Routes } from "@angular/router";
import { DayBookComponent } from "./day-book/day-book.component";
import { ProfitLossStatementComponent } from "./profit-loss-statement/profit-loss-statement.component";


export const dayBookRoutes: Routes = [
    { path: 'day-book-report', component: DayBookComponent },
    {path:'profit-loss-statement',component:ProfitLossStatementComponent}
]