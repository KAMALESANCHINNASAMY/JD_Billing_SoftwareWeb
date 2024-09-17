import { ThirdPartyGstpurReturnReportsComponent } from './../../reports/third-party-gstpur-return-reports/third-party-gstpur-return-reports.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root',
})

export class ThirdPartyPurchasegstReturnReportService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(parent: any, childarray: any) {
    return this.dialog.open(ThirdPartyGstpurReturnReportsComponent, {
      width: '924px',
      maxHeight: '700px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        parentArray: parent,
        cildArray: childarray,
      },
    });
  }
}
