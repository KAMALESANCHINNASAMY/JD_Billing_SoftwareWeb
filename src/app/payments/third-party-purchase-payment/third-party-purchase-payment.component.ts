import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { bankMasterService } from 'src/app/api-service/bankMaster.service';
import { captchaDialogService } from 'src/app/api-service/captchaDialog.service';
import { purchaseFromThirdPartyPaymentService } from 'src/app/api-service/payment/purchaseFromThirdPartyPayment.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';

@Component({
  selector: 'app-third-party-purchase-payment',
  templateUrl: './third-party-purchase-payment.component.html',
  styleUrl: './third-party-purchase-payment.component.scss',
  providers: [DatePipe]
})
export class ThirdPartyPurchasePaymentComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  suggestions: any[] = [];
  advanceArrayList: any[] = [];
  bankList: any[] = [];
  thirdPartyPayment: any[] = [];
  today = new Date().toISOString().slice(0, 10);

  constructor(
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private router: Router,
    private tHMSVC: thirdPartyMasterService,
    private cdRef: ChangeDetectorRef,
    private sMPSvc: purchaseFromThirdPartyPaymentService,
    private bSvc: bankMasterService,
    private capDialog: captchaDialogService,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    this.getThirdPartyList();
    this.getBankList();
    this.getReport(this.today);
  }

  getBankList() {
    this.bSvc.getList(this.companyID).subscribe((res) => {
      this.bankList = res
    })
  }

  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.suggestions = res;
    });
  }

  async getReport(date: string) {
    let res = await this.sMPSvc.getPayment(date, date, 0, this.companyID).toPromise();
    this.thirdPartyPayment = res || [];
  }


  thirdPartyPaymentsForm = new FormGroup({
    thirdPartyPayment_nested: new FormArray([
      new FormGroup({
        paymentid: new FormControl(0),
        third_partyid: new FormControl(null),
        date: new FormControl(this.today),
        bankid: new FormControl(0),
        amount: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        description: new FormControl(''),
        cuid: new FormControl(this.userID),
        companyid: new FormControl(this.companyID)
      })
    ])
  });

  getCommonControls(): AbstractControl[] {
    return (
      this.thirdPartyPaymentsForm.get('thirdPartyPayment_nested') as FormArray
    ).controls;
  }

  addNesForm() {
    const newControl = new FormGroup({
      paymentid: new FormControl(0),
      third_partyid: new FormControl(null),
      date: new FormControl(this.today),
      bankid: new FormControl(0),
      amount: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      description: new FormControl(''),
      cuid: new FormControl(this.userID),
      companyid: new FormControl(this.companyID)
    });
    (this.thirdPartyPaymentsForm.get('thirdPartyPayment_nested') as FormArray).push(newControl);
    this.someMethod(); // Trigger change detection
  }

  removeNesForm(index: number) {
    (this.thirdPartyPaymentsForm.get('thirdPartyPayment_nested') as FormArray).removeAt(index);
    this.someMethod(); // Trigger change detection
  }

  async save() {
    if (this.thirdPartyPaymentsForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        var value = this.thirdPartyPaymentsForm.value.thirdPartyPayment_nested;
        this.sMPSvc.addNew(value).subscribe((res) => {
          if (res.status == 'Saved successfully') {
            this.notificationSvc.success('Saved Success');
            this.cancelClick();
          } else {
            this.notificationSvc.error('Something error');
          }
        });
      }
    } else {
      this.thirdPartyPaymentsForm.markAllAsTouched();
      this.notificationSvc.error('Some required input are missing!');
    }
  }
  someMethod() {
    this.cdRef.detectChanges();
  }

  cancelClick() {
    this.thirdPartyPaymentsForm.reset();
    const control = <FormArray><unknown>(this.thirdPartyPaymentsForm.controls['thirdPartyPayment_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    this.addNesForm();
    this.getThirdPartyList();
    this.getReport(this.today);
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getFormattedDate(dateString: string): string | null {
    if (dateString) {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'dd-MM-yyyy');
    } else {
      return '';
    }
  }

  deleteClick(id: number) {
    this.capDialog.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.sMPSvc.delete(id).subscribe((res) => {
            if (res?.status == 'Deleted successfully') {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  getSupplierControl(index: number): FormControl {
    const control = (this.thirdPartyPaymentsForm.get('thirdPartyPayment_nested') as FormArray)
      .at(index)?.get('third_partyid') as FormControl;
    return control;
  }

  isSupplierInvalid(index: number): boolean {
    const control = this.getSupplierControl(index);
    return control.touched && !!control.errors;
  }

  getDateControl(index: number): FormControl {
    const control = (this.thirdPartyPaymentsForm.get('thirdPartyPayment_nested') as FormArray)
      .at(index)?.get('date') as FormControl;
    return control;
  }

  isDateInvalid(index: number): boolean {
    const control = this.getDateControl(index);
    return control.touched && !!control.errors;
  }

  getAmountControl(index: number): FormControl {
    const control = (this.thirdPartyPaymentsForm.get('thirdPartyPayment_nested') as FormArray)
      .at(index)?.get('amount') as FormControl;
    return control;
  }

  isAmountInvalid(index: number): boolean {
    const control = this.getAmountControl(index);
    return control.touched && !!control.errors;
  }

}
