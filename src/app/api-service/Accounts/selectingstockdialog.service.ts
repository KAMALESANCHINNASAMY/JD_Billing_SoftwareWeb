import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectingstockDialogComponent } from 'src/app/accounts/selectingstock-dialog/selectingstock-dialog.component';
import { SalesBillgstReportsComponent } from 'src/app/reports/sales-billgst-reports/sales-billgst-reports.component';

@Injectable({
    providedIn: 'root',
})
export class selectStockService {
    constructor(private dialog: MatDialog) { }

    openConfirmDialog(stocklist: any) {
        return this.dialog.open(SelectingstockDialogComponent, {
            width: '600px',
            minHeight: '240px',
            panelClass: 'confirm-dialog-container',
            disableClose: true,
            data: {
                allstock: stocklist,
            },
        });
    }
}
