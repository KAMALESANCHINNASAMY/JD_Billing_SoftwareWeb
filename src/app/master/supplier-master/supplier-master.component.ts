import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { SupplierMasterService } from 'src/app/api-service/supplierMaster.service';
import { ElementRef, ViewChild } from '@angular/core';
@Component({
  selector: 'app-supplier-master',
  templateUrl: './supplier-master.component.html',
  styleUrl: './supplier-master.component.scss',
})
export class SupplierMasterComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  supplierDetailsList: any[] = [];
  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private sMSvc: SupplierMasterService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getSupplierList();
  }
  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getSupplierList() {
    this.sMSvc.getList(this.companyID).subscribe((res) => {
      this.supplierDetailsList = res;
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
    const inputValue = event.target.value;
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

  setTwoDigitBalance() {
    const balanceControl = this.supplierForm.get('balance');
    let value: string | number = balanceControl?.value || 0;

    // Ensure value is treated as string for parseFloat
    if (!isNaN(Number(value)) && value !== null && value !== '') {
      value = parseFloat(value.toString()).toFixed(2).toString();
      balanceControl?.setValue(value, { emitEvent: false });
    }
  }

  setTwoDigitAdvance(i: number) {
    const getCheck = this.supplierForm.get('supplieradvance') as FormArray;
    const checkAd = getCheck.at(i).get('advanceid')?.value;
    const checkAdAm = Number(getCheck.at(i).get('advance_amount')?.value);
    const checkAdAval = Number(getCheck.at(i).get('aval_addvance')?.value);
    const oadvance_amount = Number(getCheck.at(i).get('oadvance_amount')?.value);
    if (checkAd > 0 && (oadvance_amount - checkAdAval) > checkAdAm) {
      this.notificationSvc.warn('Invalid Advance Amount');
      getCheck.at(i).get('advance_amount')?.setValue(oadvance_amount, { emitEvent: false });
    }

    const Control = this.supplierForm.get('supplieradvance') as FormArray;
    const adControl = Control.at(i).get('advance_amount');
    let value: string | number = adControl?.value || 0;
    // Ensure value is treated as string for parseFloat
    if (!isNaN(Number(value)) && value !== null && value !== '') {
      value = parseFloat(value.toString()).toFixed(2).toString();
      Control.at(i).get('advance_amount')?.setValue(value, { emitEvent: false });
    }
  }

  supplierForm = new FormGroup({
    supplierid: new FormControl(0),
    supplier_name: new FormControl(''),
    mobile_no: new FormControl(''),
    state: new FormControl(''),
    state_code: new FormControl(''),
    gst_in: new FormControl(''),
    balance: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    address: new FormControl(''),
    shipping_address: new FormControl(''),
    companyid: new FormControl(this.companyID),
    cuid: new FormControl(this.userID),
    supplieradvance: new FormArray([
      new FormGroup({
        advanceid: new FormControl(0),
        date: new FormControl('', Validators.required),
        advance_amount: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        oadvance_amount: new FormControl('0.00'),
        aval_addvance: new FormControl('0.00'),
        description: new FormControl('', Validators.required)
      }),
    ]),
  });

  getCommonControls(): AbstractControl[] {
    return (this.supplierForm.get('supplieradvance') as FormArray).controls;
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
    (this.supplierForm.get('supplieradvance') as FormArray).push(newControl);
    this.someMethod(); // Trigger change detection
  }

  removeNesForm(index: number) {
    (this.supplierForm.get('supplieradvance') as FormArray).removeAt(index);
    this.someMethod(); // Trigger change detection
  }

  someMethod() {
    this.cdRef.detectChanges();
  }

  Save() {
    if (this.supplierForm.valid) {
      if (this.supplierForm.value.supplierid == 0) {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to add this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var value = this.supplierForm.value;
              this.sMSvc.newSupplier(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Supplier name already exists ! please enter a different name');
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
              var value = this.supplierForm.value;
              this.sMSvc.newSupplier(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Supplier name already exists ! please enter a different name');
                }
                else {
                  this.notificationSvc.error('Something error');
                }
              });
            }
          });
      }
    } else {
      this.supplierForm.markAllAsTouched();
    }
  }

  async UpdateGetClick(item: any) {
    const nestedArray = await this.sMSvc.getAdvanceList(item.supplierid).toPromise();
    const control = <FormArray>this.supplierForm.controls['supplieradvance'];
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.supplierForm.patchValue(item);
      this.supplierForm.get('cuid')?.setValue(this.userID);
      nestedArray?.forEach(async (e) => {
        const newControl = new FormGroup({
          advanceid: new FormControl(e.advanceid),
          date: new FormControl(e.date, Validators.required),
          advance_amount: new FormControl(e.advance_amount, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
          aval_addvance: new FormControl(e.aval_addvance),
          oadvance_amount: new FormControl(e.advance_amount),
          description: new FormControl(e.description, Validators.required)
        });
        (this.supplierForm.get('supplieradvance') as FormArray).push(
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
          this.sMSvc.delete(id).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  isDateControlInvalid(index: number): boolean {
    const control = this.getdateControl(index);
    return control.touched && !!control.errors;
  }

  getdateControl(index: number): FormControl {
    const control = (this.supplierForm.get('supplieradvance') as FormArray)
      .at(index)
      ?.get('date') as FormControl;
    return control;
  }

  isAmountControlInvalid(index: number): boolean {
    const control = this.getAmountControl(index);
    return control.touched && !!control.errors;
  }

  getAmountControl(index: number): FormControl {
    const control = (this.supplierForm.get('supplieradvance') as FormArray)
      .at(index)
      ?.get('advance_amount') as FormControl;
    return control;
  }

  isDescriptionControlInvalid(index: number): boolean {
    const control = this.getDesControl(index);
    return control.touched && !!control.errors;
  }

  getDesControl(index: number): FormControl {
    const control = (this.supplierForm.get('supplieradvance') as FormArray)
      .at(index)
      ?.get('description') as FormControl;
    return control;
  }

  cancelClick() {
    this.supplierForm.reset();
    const control = <FormArray>this.supplierForm.controls['supplieradvance'];
    while (control.length !== 0) {
      control.removeAt(0);
    }
    this.supplierForm.get('supplierid')?.setValue(0);
    this.supplierForm.get('supplier_name')?.setValue('');
    this.supplierForm.get('mobile_no')?.setValue('');
    this.supplierForm.get('state')?.setValue('');
    this.supplierForm.get('state_code')?.setValue('');
    this.supplierForm.get('gst_in')?.setValue('');
    this.supplierForm.get('balance')?.setValue('0.00');
    this.supplierForm.get('address')?.setValue('');
    this.supplierForm.get('shipping_address')?.setValue('');
    this.supplierForm.get('companyid')?.setValue(this.companyID);
    this.supplierForm.get('cuid')?.setValue(this.userID);
    this.addNesForm();
    this.getSupplierList();
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
