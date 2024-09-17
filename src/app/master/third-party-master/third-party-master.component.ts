import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';

@Component({
  selector: 'app-third-party-master',
  templateUrl: './third-party-master.component.html',
  styleUrl: './third-party-master.component.scss',
})
export class ThirdPartyMasterComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private cdRef: ChangeDetectorRef,
    private tHMSVC: thirdPartyMasterService
  ) { }

  ngOnInit(): void {
    this.getThirdPartyList();
  }
  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
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

  stringOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return false;
    }

    return true;
  }
  preventPasteString(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    if (/\d/.test(pastedText)) {
      event.preventDefault();
      this.notificationSvc.warn('Numbers are not allowed in this field');
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
  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
    });
  }

  setTwoDigitBalance() {
    const balanceControl = this.thirdPartyForm.get('balance');
    let value: string | number = balanceControl?.value || 0;

    // Ensure value is treated as string for parseFloat
    if (!isNaN(Number(value)) && value !== null && value !== '') {
      value = parseFloat(value.toString()).toFixed(2).toString();
      balanceControl?.setValue(value, { emitEvent: false });
    }
  }

  thirdPartyForm = new FormGroup({
    third_partyid: new FormControl(0),
    party_name: new FormControl(''),
    short_code: new FormControl(''),
    mobile: new FormControl(''),
    state: new FormControl(''),
    state_code: new FormControl(''),
    address: new FormControl(''),
    balance: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    gst_in: new FormControl(''),
    companyid: new FormControl(this.companyID),
    cuid: new FormControl(this.userID),
    thirdpartyadvance: new FormArray([
      new FormGroup({
        advanceid: new FormControl(0),
        date: new FormControl('', Validators.required),
        advance_amount: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        oadvance_amount: new FormControl('0.00'),
        aval_addvance: new FormControl('0.00'),
        description: new FormControl('', Validators.required)
      }),
    ])
  });

  getCommonControls(): AbstractControl[] {
    return (this.thirdPartyForm.get('thirdpartyadvance') as FormArray).controls;
  }

  addNesForm() {
    const newControl = new FormGroup({
      advanceid: new FormControl(0),
      date: new FormControl('', [Validators.required]),
      advance_amount: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      oadvance_amount: new FormControl('0.00'),
      aval_addvance: new FormControl('0.00'),
      description: new FormControl('', [Validators.required])
    });
    (this.thirdPartyForm.get('thirdpartyadvance') as FormArray).push(newControl);
    this.someMethod(); // Trigger change detection
  }

  removeNesForm(index: number) {
    (this.thirdPartyForm.get('thirdpartyadvance') as FormArray).removeAt(index);
    this.someMethod(); // Trigger change detection
  }

  someMethod() {
    this.cdRef.detectChanges();
  }

  setTwoDigitAdvance(i: number) {
    const getCheck = this.thirdPartyForm.get('thirdpartyadvance') as FormArray;
    const checkAd = getCheck.at(i).get('advanceid')?.value;
    const checkAdAm = Number(getCheck.at(i).get('advance_amount')?.value);
    const checkAdAval = Number(getCheck.at(i).get('aval_addvance')?.value);
    const oadvance_amount = Number(getCheck.at(i).get('oadvance_amount')?.value);
    if (checkAd > 0 && (oadvance_amount - checkAdAval) > checkAdAm) {
      this.notificationSvc.warn('Invalid Advance Amount');
      getCheck.at(i).get('advance_amount')?.setValue(oadvance_amount, { emitEvent: false });
    }

    const Control = this.thirdPartyForm.get('thirdpartyadvance') as FormArray;
    const adControl = Control.at(i).get('advance_amount');
    let value: string | number = adControl?.value || 0;
    // Ensure value is treated as string for parseFloat
    if (!isNaN(Number(value)) && value !== null && value !== '') {
      value = parseFloat(value.toString()).toFixed(2).toString();
      Control.at(i).get('advance_amount')?.setValue(value, { emitEvent: false });
    }
  }

  save() {
    if (this.thirdPartyForm.valid) {
      if (this.thirdPartyForm.value.third_partyid == 0) {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to add this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var value = this.thirdPartyForm.value;
              this.tHMSVC.newParty(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('THIRD PARTY name already exists ! please enter a different name');
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
              var value = this.thirdPartyForm.value;
              this.tHMSVC.newParty(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('THIRD PARTY name already exists ! please enter a different name');
                }
                else {
                  this.notificationSvc.error('Something error');
                }
              });
            }
          });
      }
    } else {
      this.thirdPartyForm.markAllAsTouched();
    }
  }

  async UpdateGetClick(item: any) {
    const nestedArray = await this.tHMSVC.getAdvanceList(item.third_partyid).toPromise();
    const control = <FormArray>this.thirdPartyForm.controls['thirdpartyadvance'];
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.thirdPartyForm.patchValue(item);
      this.thirdPartyForm.get('cuid')?.setValue(this.userID);
      nestedArray?.forEach(async (e: any) => {
        const newControl = new FormGroup({
          advanceid: new FormControl(e.advanceid),
          date: new FormControl(e.date, Validators.required),
          advance_amount: new FormControl(e.advance_amount, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
          aval_addvance: new FormControl(e.aval_addvance),
          oadvance_amount: new FormControl(e.advance_amount),
          description: new FormControl(e.description, Validators.required)
        });
        (this.thirdPartyForm.get('thirdpartyadvance') as FormArray).push(
          newControl
        );
        this.someMethod();
      });
    }
    this.scrollToTableTop();
  }

  deleteClick(id: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.tHMSVC.delete(id).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  cancelClick() {
    this.thirdPartyForm.reset();
    const control = <FormArray>this.thirdPartyForm.controls['thirdpartyadvance'];
    while (control.length !== 0) {
      control.removeAt(0);
    }
    this.thirdPartyForm.get('third_partyid')?.setValue(0);
    this.thirdPartyForm.get('party_name')?.setValue('');
    this.thirdPartyForm.get('short_code')?.setValue('');
    this.thirdPartyForm.get('mobile')?.setValue('');
    this.thirdPartyForm.get('state')?.setValue('');
    this.thirdPartyForm.get('state_code')?.setValue('');
    this.thirdPartyForm.get('address')?.setValue('');
    this.thirdPartyForm.get('balance')?.setValue('0.00');
    this.thirdPartyForm.get('gst_in')?.setValue('');
    this.thirdPartyForm.get('companyid')?.setValue(this.companyID);
    this.thirdPartyForm.get('cuid')?.setValue(this.userID);
    this.addNesForm();
    this.getThirdPartyList();
  }


  isDateControlInvalid(index: number): boolean {
    const control = this.getdateControl(index);
    return control.touched && !!control.errors;
  }

  getdateControl(index: number): FormControl {
    const control = (this.thirdPartyForm.get('thirdpartyadvance') as FormArray)
      .at(index)
      ?.get('date') as FormControl;
    return control;
  }

  isAmountControlInvalid(index: number): boolean {
    const control = this.getAmountControl(index);
    return control.touched && !!control.errors;
  }

  getAmountControl(index: number): FormControl {
    const control = (this.thirdPartyForm.get('thirdpartyadvance') as FormArray)
      .at(index)
      ?.get('advance_amount') as FormControl;
    return control;
  }

  isDescriptionControlInvalid(index: number): boolean {
    const control = this.getDesControl(index);
    return control.touched && !!control.errors;
  }

  getDesControl(index: number): FormControl {
    const control = (this.thirdPartyForm.get('thirdpartyadvance') as FormArray)
      .at(index)
      ?.get('description') as FormControl;
    return control;
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
