import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { weaverMasterService } from 'src/app/api-service/weaverMaster.service';

@Component({
  selector: 'app-weaver-master',
  templateUrl: './weaver-master.component.html',
  styleUrls: ['./weaver-master.component.scss'],
})
export class WeaverMasterComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  weaverDetailsList: any[] = [];
  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private wMSvc: weaverMasterService
  ) { }

  ngOnInit(): void {
    this.getWeaverList();
  }
  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getWeaverList() {
    this.wMSvc.getList(this.companyID).subscribe((res) => {
      this.weaverDetailsList = res;
    });
  }

  stringOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return false;
    }

    return true;
  }
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const inputValue = event.target.value;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    if (inputValue.length >= 10) {
      return false;
    }

    return true;
  }

  numberOnlyN(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }

  preventPasteString(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    if (/\d/.test(pastedText)) {
      event.preventDefault();
      this.notificationSvc.warn('Numbers are not allowed in the state field');
    }
  }

  preventPasteNumber(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    if (/[a-zA-Z]/.test(pastedText)) {
      event.preventDefault();
      this.notificationSvc.warn('Only numbers are allowed in this field');
    }
  }

  setTwoDigitBalance() {
    const balanceControl = this.weaverForm.get('balance');
    let value: string | number = balanceControl?.value || 0;

    // Ensure value is treated as string for parseFloat
    if (!isNaN(Number(value)) && value !== null && value !== '') {
      value = parseFloat(value.toString()).toFixed(2).toString();
      balanceControl?.setValue(value, { emitEvent: false });
    }
  }

  numberOnlyStateCode(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const inputValue = event.target.value;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    if (inputValue.length == 2) {
      return false;
    }

    return true;
  }
  weaverForm = new FormGroup({
    weaverid: new FormControl(0),
    weaver_name: new FormControl(''),
    short_code: new FormControl(''),
    mobile: new FormControl(''),
    address: new FormControl(''),
    balance: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    state: new FormControl(''),
    state_code: new FormControl(''),
    companyid: new FormControl(this.companyID),
    cuid: new FormControl(this.userID),
  });

  Save() {
    if (this.weaverForm.valid) {
      if (this.weaverForm.value.weaverid == 0) {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to add this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var value = this.weaverForm.value;
              this.wMSvc.newWeaver(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Weaver name already exists ! please enter a different name');
                }
                else {
                  this.notificationSvc.error('Something error');
                }
              });
            }
          });
      } else {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to edit this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var value = this.weaverForm.value;
              this.wMSvc.newWeaver(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Weaver name already exists ! please enter a different name');
                }
                else {
                  this.notificationSvc.error('Something error');
                }
              });
            }
          });
      }
    } else {
      this.weaverForm.markAllAsTouched();
    }
  }

  UpdateGetClick(item: any) {
    this.weaverForm.patchValue(item);
    this.weaverForm.get('cuid')?.setValue(this.userID);

    this.scrollToTableTop();
  }

  deleteClick(id: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.wMSvc.delete(id).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  cancelClick() {
    this.weaverForm.reset();
    this.weaverForm.get('weaverid')?.setValue(0);
    this.weaverForm.get('weaver_name')?.setValue('');
    this.weaverForm.get('short_code')?.setValue('');
    this.weaverForm.get('mobile')?.setValue('');
    this.weaverForm.get('address')?.setValue('');
    this.weaverForm.get('state')?.setValue('');
    this.weaverForm.get('state_code')?.setValue('');
    this.weaverForm.get('balance')?.setValue('0.00');
    this.weaverForm.get('companyid')?.setValue(this.companyID);
    this.weaverForm.get('cuid')?.setValue(this.userID);

    this.getWeaverList();
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
