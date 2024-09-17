import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { customerPaymentService } from 'src/app/api-service/payment/customerPayment.service';

@Component({
  selector: 'app-customer-payments',
  templateUrl: './customer-payments.component.html',
  styleUrl: './customer-payments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerPaymentsComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  customerDetailsList: any[] = [];
  suggestions: any[] = [];
  advanceArrayList: any[] = [];

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private cMSvc: customerMasterService,
    private cdRef: ChangeDetectorRef,
    private cPSvc: customerPaymentService
  ) { }

  async ngOnInit() {
    this.getCustomerList();
  }

  someMethod() {
    this.cdRef.detectChanges();
  }
  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }
  getCustomerList() {
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.customerDetailsList = res;
      this.suggestions = res;
    });
  }

  async setCustomerDetails(id: any) {
    const newArray = this.customerDetailsList.filter((e) => {
      return e.customerid == id;
    });
    if (newArray.length > 0) {
      this.customerPaymentForm.get('customerid')?.setValue(id);
      this.customerPaymentForm.get('balance')?.setValue(newArray[0].c_balance);
      this.advanceArrayList = await this.cMSvc.getAdvanceList(id).toPromise() || [];
      await this.getPaymentForCustomer(id);

      this.someMethod(); // Trigger change detection
    }
  }
  suggest(value: any) {
    this.suggestions = this.customerDetailsList.filter((item) =>
      item.customer_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.customerDetailsList;
  }

  async getPaymentForCustomer(id: number): Promise<void> {
    const newPaymentList = await this.cPSvc.getCustomerPaymentLists(id).toPromise();

    const control = <FormArray><unknown>(
      this.customerPaymentForm.controls['customerpayment_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }

    if (control.length == 0) {
      newPaymentList?.forEach((eee: any) => {
        if (Number(eee.totalcal.toFixed(2)) > 0) {
          const newControl = new FormGroup({
            isselect: new FormControl(false),
            payment_n_id: new FormControl(0),
            entryid: new FormControl(eee.entryid),
            customerid: new FormControl(eee.customerid),
            date: new FormControl(eee.date),
            bill_no: new FormControl(eee.bill_no),
            total: new FormControl(String(eee.tot.toFixed(2))),
            ret_total: new FormControl(eee.retTot),
            de: new FormControl(eee.de),
            total_amount: new FormControl(String(eee.totalcal.toFixed(2))),
            deduction_amount: new FormControl('0.00'),
            gst: new FormControl(eee.gst),
            non_gst: new FormControl(eee.non_gst),
            isbal: new FormControl(eee.isbal)
          });
          (
            this.customerPaymentForm.get('customerpayment_nested') as FormArray
          ).push(newControl);
        }
      });
    }

    const controlvalue = <FormArray><unknown>(
      this.customerPaymentForm.controls['customerpayment_nested']
    );
    const nTotAmount = controlvalue.value?.reduce((acc: any, val: any) => (acc += Number(val.total_amount)), 0);

    this.customerPaymentForm.get('n_total_amount')?.setValue(String(nTotAmount.toFixed(2)));
  }

  setAmountMode() {
    this.customerPaymentForm.get('n_amount')?.setValue('');
    this.customerPaymentForm.get('adnp_amount')?.setValue('0.00');
    this.customerPaymentForm.get('advanceid')?.setValue(0);
    this.deductionTotalAmount(this.customerPaymentForm.value.n_amount);
  }

  deductionTotalAmount(namv: any) {
    if (Number(namv) > Number(this.customerPaymentForm.value.n_total_amount)) {
      this.customerPaymentForm.get('n_amount')?.setValue('');
    }
    const control = <FormArray><unknown>(
      this.customerPaymentForm.controls['customerpayment_nested']
    );
    let amount = 0;
    amount = Number(this.customerPaymentForm.value.n_amount);
    let bal = 0;
    control.value.forEach((e: any, i: number) => {
      debugger;
      control.at(i).get('isselect')?.setValue(false);
      const totalAmount = Number(e.total_amount);
      if (amount < totalAmount) {
        let balance = totalAmount - amount;
        amount = 0;
        control.at(i).get('deduction_amount')?.setValue(String((totalAmount - balance).toFixed(2)));
      } else {
        bal = amount - totalAmount;
        control.at(i).get('deduction_amount')?.setValue(String((amount - bal).toFixed(2)));
        amount = bal;
      }
    });
  }

  customerPaymentForm = new FormGroup({
    paymentid: new FormControl(0),
    customerid: new FormControl(null),
    date: new FormControl(''),
    balance: new FormControl(''),
    amount_mode: new FormControl('invoice'),
    payment_type: new FormControl('Cash'),
    advanceid: new FormControl(0),
    cheque_no: new FormControl(''),
    c_date: new FormControl(''),
    c_amount: new FormControl(''),
    n_amount: new FormControl('', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    adnp_amount: new FormControl('0.00', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    n_total_amount: new FormControl('0'),
    customerpayment_nested: new FormArray([]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (this.customerPaymentForm.get('customerpayment_nested') as FormArray).controls;
  }

  setDeduction(i: number, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    const control = <FormArray><unknown>(
      this.customerPaymentForm.controls['customerpayment_nested']
    );
    const totalAmount = Number(control.at(i).get('total_amount')?.value);
    if (isChecked) {
      control.at(i).get('deduction_amount')?.setValue(String(totalAmount.toFixed(2)));
    } else {
      control.at(i).get('deduction_amount')?.setValue('0.00');
    }
  }

  async save() {
    if (this.customerPaymentForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        var value = this.customerPaymentForm.value;
        this.cPSvc.addNew(value).subscribe((res) => {
          if (res.status == 'Saved successfully') {
            this.notificationSvc.success('Saved Success');
            this.cancelClick();
          } else {
            this.notificationSvc.error('Something error');
          }
        });
      }
    } else {
      this.customerPaymentForm.markAllAsTouched();
      this.notificationSvc.error('Some required input are missing!');
    }
  }

  async setTwoDigitBalance() {
    const balanceControl = this.customerPaymentForm.get('adnp_amount');
    let value: string | number = balanceControl?.value || 0;

    // Ensure value is treated as string for parseFloat
    if (!isNaN(Number(value)) && value !== null && value !== '') {
      value = parseFloat(value.toString()).toFixed(2).toString();
      balanceControl?.setValue(value, { emitEvent: false });
    }
  }

  async deductionAdvanceAmount(naadv: any) {
    debugger
    const getAdvan = Number(this.advanceArrayList.find((e) => { return e.advanceid == this.customerPaymentForm.value.advanceid })?.aval_addvance || 0);
    await this.setTwoDigitBalance();
    debugger
    if (Number(naadv) > Number(this.customerPaymentForm.value.n_total_amount) || Number(naadv) > getAdvan) {
      this.customerPaymentForm.get('adnp_amount')?.setValue('0.00');
      this.notificationSvc.error('Amount is invalid');
    }
    const control = <FormArray><unknown>(
      this.customerPaymentForm.controls['customerpayment_nested']
    );
    let amount = 0;
    amount = Number(this.customerPaymentForm.value.adnp_amount);
    let bal = 0;
    control.value.forEach((e: any, i: number) => {
      control.at(i).get('isselect')?.setValue(false);
      const totalAmount = Number(e.total_amount);
      if (amount < totalAmount) {
        let balance = totalAmount - amount;
        amount = 0;
        control.at(i).get('deduction_amount')?.setValue(String((totalAmount - balance).toFixed(2)));
      } else {
        bal = amount - totalAmount;
        control.at(i).get('deduction_amount')?.setValue(String((amount - bal).toFixed(2)));
        amount = bal;
      }
    });
  }

  cancelClick() {
    this.customerPaymentForm.reset();
    const control = <FormArray><unknown>(
      this.customerPaymentForm.controls['customerpayment_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.customerPaymentForm.get('paymentid')?.setValue(0);
    this.customerPaymentForm.get('customerid')?.setValue(null);
    this.customerPaymentForm.get('date')?.setValue('');
    this.customerPaymentForm.get('balance')?.setValue('');
    this.customerPaymentForm.get('amount_mode')?.setValue('invoice');
    this.customerPaymentForm.get('payment_type')?.setValue('Cash');
    this.customerPaymentForm.get('cheque_no')?.setValue('');
    this.customerPaymentForm.get('c_date')?.setValue('');
    this.customerPaymentForm.get('c_amount')?.setValue('');
    this.customerPaymentForm.get('n_total_amount')?.setValue('0');
    this.customerPaymentForm.get('cuid')?.setValue(this.userID);
    this.customerPaymentForm.get('companyid')?.setValue(this.companyID);
    this.customerPaymentForm.get('adnp_amount')?.setValue('0.00');
    this.customerPaymentForm.get('advanceid')?.setValue(0);

    this.getCustomerList();
  }
}
