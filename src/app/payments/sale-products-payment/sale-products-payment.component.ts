import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { bankMasterService } from 'src/app/api-service/bankMaster.service';
import { captchaDialogService } from 'src/app/api-service/captchaDialog.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { salesProductPaymentService } from 'src/app/api-service/payment/salesProductPayment.service';
import { salesProductReportService } from 'src/app/api-service/salesProductReport.service';

@Component({
  selector: 'app-sale-products-payment',
  templateUrl: './sale-products-payment.component.html',
  styleUrl: './sale-products-payment.component.scss',
  providers: [DatePipe]
})
export class SaleProductsPaymentComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  customerDetailsList: any[] = [];
  suggestions: any[] = [];
  advanceArrayList: any[] = [];
  bankList: any[] = [];
  today = new Date().toISOString().slice(0, 10);
  customerPayment: any[] = [];

  constructor(
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private router: Router,
    private cMSvc: customerMasterService,
    private cdRef: ChangeDetectorRef,
    private sMPSvc: salesProductPaymentService,
    private bSvc: bankMasterService,
    private datePipe: DatePipe,
    private capDialog: captchaDialogService,
    private RMPRSVC: salesProductReportService
  ) { }

  async ngOnInit() {
    this.getCustomerList();
    this.getBankList();
    this.getReport(this.today);
  }

  getBankList() {
    this.bSvc.getList(this.companyID).subscribe((res) => {
      this.bankList = res
    })
  }

  getCustomerList() {
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.customerDetailsList = res;
      this.suggestions = res;
    });
  }

  paymentsForm = new FormGroup({
    customerpayment_nested: new FormArray([
      new FormGroup({
        paymentid: new FormControl(0),
        customerid: new FormControl(null),
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
      this.paymentsForm.get('customerpayment_nested') as FormArray
    ).controls;
  }

  async save() {
    if (this.paymentsForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        var value = this.paymentsForm.value.customerpayment_nested;
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
      this.paymentsForm.markAllAsTouched();
      this.notificationSvc.error('Some required input are missing!');
    }
  }
  someMethod() {
    this.cdRef.detectChanges();
  }

  addNesForm() {
    const newControl = new FormGroup({
      paymentid: new FormControl(0),
      customerid: new FormControl(null),
      date: new FormControl(this.today),
      bankid: new FormControl(0),
      amount: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      description: new FormControl(''),
      cuid: new FormControl(this.userID),
      companyid: new FormControl(this.companyID)
    });
    (this.paymentsForm.get('customerpayment_nested') as FormArray).push(newControl);
    this.someMethod(); // Trigger change detection
  }

  removeNesForm(index: number) {
    (this.paymentsForm.get('customerpayment_nested') as FormArray).removeAt(index);
    this.someMethod(); // Trigger change detection
  }


  cancelClick() {
    this.paymentsForm.reset();
    const control = <FormArray><unknown>(this.paymentsForm.controls['customerpayment_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    this.getReport(this.today);
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }


  async getReport(date: string) {
    let res = await this.RMPRSVC.getPayment(date, date, 0, this.companyID).toPromise();
    this.customerPayment = res || [];
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
          this.RMPRSVC.delete(id).subscribe((res) => {
            if (res?.status == 'Deleted successfully') {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }


  getSupplierControl(index: number): FormControl {
    const control = (this.paymentsForm.get('customerpayment_nested') as FormArray)
      .at(index)?.get('customerid') as FormControl;
    return control;
  }

  isSupplierInvalid(index: number): boolean {
    const control = this.getSupplierControl(index);
    return control.touched && !!control.errors;
  }

  getDateControl(index: number): FormControl {
    const control = (this.paymentsForm.get('customerpayment_nested') as FormArray)
      .at(index)?.get('date') as FormControl;
    return control;
  }

  isDateInvalid(index: number): boolean {
    const control = this.getDateControl(index);
    return control.touched && !!control.errors;
  }

  getAmountControl(index: number): FormControl {
    const control = (this.paymentsForm.get('customerpayment_nested') as FormArray)
      .at(index)?.get('amount') as FormControl;
    return control;
  }

  isAmountInvalid(index: number): boolean {
    const control = this.getAmountControl(index);
    return control.touched && !!control.errors;
  }
}
