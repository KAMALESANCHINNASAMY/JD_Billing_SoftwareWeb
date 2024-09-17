import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThirdPartyNongstpurReturnReportsComponent } from 'src/app/reports/third-party-nongstpur-return-reports/third-party-nongstpur-return-reports.component';


@Injectable({
  providedIn: 'root',
})

export class ThirdPartyPurchaseNongstReturnReportService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(parent: any, childarray: any) {
    return this.dialog.open(ThirdPartyNongstpurReturnReportsComponent, {
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
