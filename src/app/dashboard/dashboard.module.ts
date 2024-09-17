import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material.module';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.route';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DashboardComponent],
  imports: [RouterModule.forChild(dashboardRoutes), MaterialModule, CommonModule],
  exports: [RouterModule],
  providers: [],
})
export class DashboardModule {
  constructor() {

  }
}
