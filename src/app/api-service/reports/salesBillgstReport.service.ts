import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SalesBillgstReportsComponent } from 'src/app/reports/sales-billgst-reports/sales-billgst-reports.component';

@Injectable({
  providedIn: 'root',
})
export class salesBillgstReportService {
  constructor(private dialog: MatDialog) { }

  openConfirmDialog(multipleSalesList: any) {
    return this.dialog.open(SalesBillgstReportsComponent, {
      width: '854px',
      maxHeight: '94vh',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        multipleSalesListReport: multipleSalesList,
      },
    });
  }
}
