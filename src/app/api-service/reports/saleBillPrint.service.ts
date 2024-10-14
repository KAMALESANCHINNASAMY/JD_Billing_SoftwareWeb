import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SalesBillComponent } from 'src/app/PrintBill/sales-bill/sales-bill.component';


@Injectable({
    providedIn: 'root',
})

export class salesBillPrintService {

    constructor(private dialog: MatDialog) { }

    openConfirmDialog(parent: any, child: any) {
        return this.dialog.open(SalesBillComponent, {
            width: '854px',
            height: '97vh',
            panelClass: 'confirm-dialog-container',
            disableClose: true,
            data: {
                parent: parent,
                child: child
            },
        });
    }

}
