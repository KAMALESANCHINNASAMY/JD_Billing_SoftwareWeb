import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-captcha-dialog',
  standalone: false,
  templateUrl: './captcha-dialog.component.html',
  styleUrl: './captcha-dialog.component.scss'
})
export class CaptchaDialogComponent {
  isRefreshing = false;
  captcha: any;

  constructor(
    public dialogRef: MatDialogRef<CaptchaDialogComponent>,
    private notificationSvc: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.generateCaptcha();
  }

  closedialog() {
    this.dialogRef.close(false);
  }

  async generateCaptcha() {
    this.captcha = Math.floor(Math.random() * 90000) + 10000;
  }

  async refresh() {
    this.isRefreshing = true;
    await this.generateCaptcha();
    setTimeout(() => {
      this.isRefreshing = false;
    }, 1000); // Duration of the animation in milliseconds
  }

  checkcap(value: any) {    
    if (this.captcha == value) {
      this.dialogRef.close(true);
    }
    else {
      this.notificationSvc.error('Invalid Captcha !')
    }
  }
}
