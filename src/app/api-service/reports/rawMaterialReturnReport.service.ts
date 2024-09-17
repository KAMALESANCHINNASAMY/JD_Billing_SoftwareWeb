import { RawMaterialReturnReportsComponent } from './../../reports/raw-material-return-reports/raw-material-return-reports.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root',
})
export class RawMaterialReturnReportService {
  constructor(private dialog: MatDialog) { }

  openConfirmDialog(parent: any, childarray: any) {
    return this.dialog.open(RawMaterialReturnReportsComponent, {
      width: '800px',
      maxHeight: '600px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        parentArray: parent,
        cildArray: childarray,
      },
    });
  }

}
