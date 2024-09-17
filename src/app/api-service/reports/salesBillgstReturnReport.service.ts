import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SalesBillgstReturnReportsComponent } from 'src/app/reports/sales-billgst-return-reports/sales-billgst-return-reports.component';

@Injectable({
  providedIn: 'root',
})

export class salesBillgstReturnReportService {
  constructor(private dialog: MatDialog) {}

  openConfirmDialog(parent: any, childarray: any) {
    return this.dialog.open(SalesBillgstReturnReportsComponent, {
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
