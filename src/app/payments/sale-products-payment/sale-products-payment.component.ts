import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { bankMasterService } from 'src/app/api-service/bankMaster.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { salesProductPaymentService } from 'src/app/api-service/payment/salesProductPayment.service';

@Component({
  selector: 'app-sale-products-payment',
  templateUrl: './sale-products-payment.component.html',
  styleUrl: './sale-products-payment.component.scss'
})
export class SaleProductsPaymentComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  customerDetailsList: any[] = [];
  suggestions: any[] = [];
  advanceArrayList: any[] = [];
  bankList: any[] = [];

  constructor(
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private router: Router,
    private cMSvc: customerMasterService,
    private cdRef: ChangeDetectorRef,
    private sMPSvc: salesProductPaymentService,
    private bSvc: bankMasterService
  ) { }

  async ngOnInit() {
    this.getCustomerList();
    this.getBankList();
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
  suggest(value: any) {
    this.suggestions = this.customerDetailsList.filter((item) =>
      item.customer_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.customerDetailsList;
  }

  paymentsForm = new FormGroup({
    paymentid: new FormControl(0),
    customerid: new FormControl(0),
    bankid: new FormControl(0),
    date: new FormControl(''),
    balance: new FormControl(''),
    advanceid: new FormControl(0),
    amount_mode: new FormControl('invoice'),
    payment_type: new FormControl('Cash'),
    cheque_no: new FormControl(''),
    c_date: new FormControl(''),
    c_amount: new FormControl(''),
    n_amount: new FormControl('', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    adnp_amount: new FormControl('0.00', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    n_total_amount: new FormControl('0.00'),
    customerpayment_nested: new FormArray([]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  async getPaymentForSupplier(id: number): Promise<void> {
    const newPaymentList = await this.sMPSvc.getPaymentsLists(id).toPromise();

    const control = <FormArray><unknown>(
      this.paymentsForm.controls['customerpayment_nested']
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
            isbill: new FormControl(eee.isbill),
            isbal: new FormControl(eee.isbal)
          });
          (
            this.paymentsForm.get('customerpayment_nested') as FormArray
          ).push(newControl);
        }
      });
    }

    const controlvalue = <FormArray><unknown>(this.paymentsForm.controls['customerpayment_nested']);

    const nTotAmount = controlvalue.value?.reduce((acc: any, val: any) => (acc += Number(val.total_amount)), 0);

    this.paymentsForm.get('n_total_amount')?.setValue(String(nTotAmount.toFixed(2)));
  }

  getCommonControls(): AbstractControl[] {
    return (
      this.paymentsForm.get('customerpayment_nested') as FormArray
    ).controls;
  }

  setDeduction(i: number, event: Event) {
    const checkbox = event.target as HTMLInputElement
    const isChecked = checkbox.checked;
    const control = <FormArray><unknown>(
      this.paymentsForm.controls['customerpayment_nested']
    );
    const totalAmount = Number(control.at(i).get('total_amount')?.value);
    if (isChecked) {
      control.at(i).get('deduction_amount')?.setValue(String(totalAmount.toFixed(2)));
    } else {
      control.at(i).get('deduction_amount')?.setValue('0.00');
    }
  }

  async setDetails(id: any) {
    const newArray = this.customerDetailsList.filter((e) => {
      return e.customerid == id;
    });
    if (newArray.length > 0) {
      this.paymentsForm.get('customerid')?.setValue(id);
      this.paymentsForm.get('balance')?.setValue(newArray[0].c_balance);
      this.advanceArrayList = await this.cMSvc.getAdvanceList(id).toPromise() || [];
      await this.getPaymentForSupplier(id);
      this.someMethod(); // Trigger change detection
    }
  }

  async setTwoDigitBalance() {
    const balanceControl = this.paymentsForm.get('adnp_amount');
    let value: string | number = balanceControl?.value || 0;

    // Ensure value is treated as string for parseFloat
    if (!isNaN(Number(value)) && value !== null && value !== '') {
      value = parseFloat(value.toString()).toFixed(2).toString();
      balanceControl?.setValue(value, { emitEvent: false });
    }
  }

  setAmountMode() {
    this.paymentsForm.get('n_amount')?.setValue('');
    this.paymentsForm.get('adnp_amount')?.setValue('0.00');
    this.paymentsForm.get('advanceid')?.setValue(0);
    this.deductionTotalAmount(this.paymentsForm.value.n_amount);
  }

  deductionTotalAmount(namv: any) {
    if (Number(namv) > Number(this.paymentsForm.value.n_total_amount)) {
      this.paymentsForm.get('n_amount')?.setValue('');
      this.notificationSvc.error('Amount is invalid');
    }
    const control = <FormArray><unknown>(
      this.paymentsForm.controls['customerpayment_nested']
    );
    let amount = 0;
    amount = Number(this.paymentsForm.value.n_amount);
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

  async deductionAdvanceAmount(naadv: any) {
    debugger
    const getAdvan = Number(this.advanceArrayList.find((e) => { return e.advanceid == this.paymentsForm.value.advanceid })?.aval_addvance || 0);
    await this.setTwoDigitBalance();
    debugger
    if (Number(naadv) > Number(this.paymentsForm.value.n_total_amount) || Number(naadv) > getAdvan) {
      this.paymentsForm.get('adnp_amount')?.setValue('0.00');
      this.notificationSvc.error('Amount is invalid');
    }
    const control = <FormArray><unknown>(
      this.paymentsForm.controls['customerpayment_nested']
    );
    let amount = 0;
    amount = Number(this.paymentsForm.value.adnp_amount);
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

  async save() {
    if (this.paymentsForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        var value = this.paymentsForm.value;
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

  cancelClick() {
    this.paymentsForm.reset();
    const control = <FormArray><unknown>(this.paymentsForm.controls['customerpayment_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.paymentsForm.get('paymentid')?.setValue(0);
    this.paymentsForm.get('customerid')?.setValue(null);
    this.paymentsForm.get('bankid')?.setValue(0);
    this.paymentsForm.get('date')?.setValue('');
    this.paymentsForm.get('balance')?.setValue('');
    this.paymentsForm.get('amount_mode')?.setValue('invoice');
    this.paymentsForm.get('payment_type')?.setValue('Cash');
    this.paymentsForm.get('cheque_no')?.setValue('');
    this.paymentsForm.get('c_date')?.setValue('');
    this.paymentsForm.get('c_amount')?.setValue('');
    this.paymentsForm.get('n_amount')?.setValue('');
    this.paymentsForm.get('adnp_amount')?.setValue('0.00');
    this.paymentsForm.get('advanceid')?.setValue(0);
    this.paymentsForm.get('n_total_amount')?.setValue('0.00');
    this.paymentsForm.get('cuid')?.setValue(this.userID);
    this.paymentsForm.get('companyid')?.setValue(this.companyID);
    this.getCustomerList();
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }
}
