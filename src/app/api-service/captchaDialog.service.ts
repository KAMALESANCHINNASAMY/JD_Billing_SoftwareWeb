import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CaptchaDialogComponent } from "../master/captcha-dialog/captcha-dialog.component";

@Injectable({
    providedIn: 'root'
})
export class captchaDialogService {

    constructor(private dialog: MatDialog) { }

    openConfirmDialog(msg: string) {
        return this.dialog.open(CaptchaDialogComponent, {
            width: '400px',
            panelClass: 'confirm-dialog-container',
            disableClose: true,
            data: {
                message: msg
            }
        });
    }
}
