import { ThirdPartyGstpurchaseReportsComponent } from './../../reports/third-party-gstpurchase-reports/third-party-gstpurchase-reports.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root',
})

export class ThirdPartyPurchaseReportService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(thirdPartygstPurchaseReports: any) {
    return this.dialog.open(ThirdPartyGstpurchaseReportsComponent, {
      width: '804px',
      maxHeight: '700px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        thirdPartygstPurchaseReports: thirdPartygstPurchaseReports,
      },
    });
  }
}
