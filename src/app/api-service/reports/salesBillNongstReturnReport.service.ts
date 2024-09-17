import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SalesBillnongstReturnReportsComponent } from 'src/app/reports/sales-billnongst-return-reports/sales-billnongst-return-reports.component';

@Injectable({
  providedIn: 'root',
})

export class salesBillNongstReturnReportService {

  constructor(private dialog: MatDialog) {}


  openConfirmDialog(parent: any, childarray: any) {
    debugger
    return this.dialog.open(SalesBillnongstReturnReportsComponent, {
      width: '1024px',
      height: '700px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        parentArray: parent,
        cildArray: childarray,
      },
    });
  }
}
