import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RawMaterialPurchaseReportsComponent } from 'src/app/reports/raw-material-purchase-reports/raw-material-purchase-reports.component';

@Injectable({
  providedIn: 'root',
})
export class RawMaterialPurchaseReportService {
  constructor(private dialog: MatDialog) {}

  openConfirmDialog(rawMaterialPurchaseList: any) {
    return this.dialog.open(RawMaterialPurchaseReportsComponent, {
      width: '804px',
      height: '700px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
       rawMaterialPurchaseList: rawMaterialPurchaseList,
      },
    });
  }

}
