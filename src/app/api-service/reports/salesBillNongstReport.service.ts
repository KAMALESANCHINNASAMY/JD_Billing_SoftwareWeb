import { SalesBillnongstReportsComponent } from './../../reports/sales-billnongst-reports/sales-billnongst-reports.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root',
})

export class salesBillNongstReportService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(multipleSalesNongstList: any) {
    debugger
    return this.dialog.open(SalesBillnongstReportsComponent, {
      width: '854px',
      height: '97%',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        multipleSalesNongstList: multipleSalesNongstList,
      },
    });
  }

}
