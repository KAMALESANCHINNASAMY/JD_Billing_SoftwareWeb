import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { handCashEntryService } from 'src/app/api-service/handCashEntry.service';

@Component({
  selector: 'app-hand-cash-entry',
  templateUrl: './hand-cash-entry.component.html',
  styleUrl: './hand-cash-entry.component.scss'
})
export class HandCashEntryComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  cashList: any[] = [];
  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private bSvc: handCashEntryService
  ) { }

  ngOnInit(): void {
    this.getCashList();
  }
  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getCashList() {
    this.bSvc.getList(this.companyID).subscribe((res) => {
      this.cashList = res
    })
  }
  handCashForm = new FormGroup({
    cashid: new FormControl(0),
    amount: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    date: new FormControl(''),
    description: new FormControl(''),
    companyid: new FormControl(this.companyID),
    cuid: new FormControl(this.userID)
  });

  Save() {
    if (this.handCashForm.valid) {
      if (this.handCashForm.value.cashid == 0) {
        this.DialogSvc.openConfirmDialog('Are you sure want to add this record ?').afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var value = this.handCashForm.value;
              this.bSvc.newHandCash(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else {
                  this.notificationSvc.error('Something error');
                }
              });
            }
          });
      } else {
        this.DialogSvc.openConfirmDialog('Are you sure want to edit this record ?').afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var value = this.handCashForm.value;
              this.bSvc.newHandCash(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else {
                  this.notificationSvc.error('Something error');
                }
              });
            }
          });
      }
    }
    else {
      this.handCashForm.markAllAsTouched();
    }
  }

  UpdateGetClick(item: any) {
    this.handCashForm.patchValue(item);
    this.handCashForm.get('cuid')?.setValue(this.userID);
    this.scrollToTableTop();
  }

  deleteClick(id: number) {
    this.DialogSvc.openConfirmDialog('Are you sure want to delete this record ?').afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.bSvc.delete(id).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  cancelClick() {
    this.handCashForm.reset();
    this.handCashForm.get('cashid')?.setValue(0);
    this.handCashForm.get('amount')?.setValue('');
    this.handCashForm.get('date')?.setValue('');
    this.handCashForm.get('description')?.setValue('');
    this.handCashForm.get('companyid')?.setValue(this.companyID);
    this.handCashForm.get('cuid')?.setValue(this.userID);

    this.getCashList();
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
