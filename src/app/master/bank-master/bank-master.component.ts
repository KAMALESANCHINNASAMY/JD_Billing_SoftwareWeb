import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { bankMasterService } from 'src/app/api-service/bankMaster.service';

@Component({
  selector: 'app-bank-master',
  templateUrl: './bank-master.component.html',
  styleUrl: './bank-master.component.scss'
})
export class BankMasterComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  bankList: any[] = [];
  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private bSvc: bankMasterService
  ) { }

  ngOnInit(): void {
    this.getBankList();
  }
  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getBankList() {
    this.bSvc.getList(this.companyID).subscribe((res) => {
      this.bankList = res
    })
  }
  bankMasterForm = new FormGroup({
    bankid: new FormControl(0),
    bank_name: new FormControl(''),
    ac_holder_name: new FormControl(''),
    ac_no: new FormControl(''),
    ifsc_code: new FormControl(''),
    companyid: new FormControl(this.companyID),
    cuid: new FormControl(this.userID)
  });

  Save() {
    if (this.bankMasterForm.valid) {
      if (this.bankMasterForm.value.bankid == 0) {
        this.DialogSvc.openConfirmDialog('Are you sure want to add this record ?').afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var value = this.bankMasterForm.value;
              this.bSvc.newBank(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Account Number already exists! Use a different Account Number');
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
              var value = this.bankMasterForm.value;
              this.bSvc.newBank(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Account Number already exists! Use a different Account Number');
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
      this.bankMasterForm.markAllAsTouched();
    }
  }

  UpdateGetClick(item: any) {
    this.bankMasterForm.patchValue(item);
    this.bankMasterForm.get('cuid')?.setValue(this.userID);
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
    this.bankMasterForm.reset();
    this.bankMasterForm.get('bankid')?.setValue(0);
    this.bankMasterForm.get('bank_name')?.setValue('');
    this.bankMasterForm.get('ac_holder_name')?.setValue('');
    this.bankMasterForm.get('ac_no')?.setValue('');
    this.bankMasterForm.get('ifsc_code')?.setValue('');
    this.bankMasterForm.get('companyid')?.setValue(this.companyID);
    this.bankMasterForm.get('cuid')?.setValue(this.userID);

    this.getBankList();
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
