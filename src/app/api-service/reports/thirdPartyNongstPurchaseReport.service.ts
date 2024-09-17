import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThirdPartyNongstPurchaseReportComponent } from 'src/app/reports/third-party-nongst-purchase-report/third-party-nongst-purchase-report.component';

@Injectable({
  providedIn: 'root',
})

export class ThirdPartyNongstPurchaseReportService {

  constructor(private dialog: MatDialog) { }
  openConfirmDialog(thirdPartyNongstPurchaseReports: any) {
    return this.dialog.open(ThirdPartyNongstPurchaseReportComponent, {
      width: '804px',
      maxHeight: '700px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        thirdPartyNongstPurchaseReports: thirdPartyNongstPurchaseReports,
      },
    });
  }

}
