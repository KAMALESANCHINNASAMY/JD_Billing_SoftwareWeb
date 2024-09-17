import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { SupplierMasterService } from 'src/app/api-service/supplierMaster.service';
import { supplierPaymentService } from 'src/app/api-service/payment/supplierPayment.service';

@Component({
  selector: 'app-supplier-payments',
  templateUrl: './supplier-payments.component.html',
  styleUrl: './supplier-payments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierPaymentsComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  supplierDetailsList: any[] = [];
  suggestions: any[] = [];
  advanceArrayList: any[] = [];

  constructor(
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private router: Router,
    private sMSvc: SupplierMasterService,
    private cdRef: ChangeDetectorRef,
    private sMPSvc: supplierPaymentService
  ) { }

  async ngOnInit() {
    this.getSupplierList();
  }

  supplierPaymentsForm = new FormGroup({
    supplierid: new FormControl(0),
    paymentid: new FormControl(0),
    date: new FormControl(''),
    balance: new FormControl(''),
    amount_mode: new FormControl('invoice'),
    advanceid: new FormControl(0),
    payment_type: new FormControl('Cash'),
    cheque_no: new FormControl(''),
    c_date: new FormControl(''),
    c_amount: new FormControl(''),
    n_amount: new FormControl('', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    adnp_amount: new FormControl('0.00', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    n_total_amount: new FormControl('0.00'),
    supplierpayment_nested: new FormArray([]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  async getPaymentForSupplier(id: number): Promise<void> {
    const newPaymentList = await this.sMPSvc.getSupplierPaymentsLists(id).toPromise();

    const control = <FormArray><unknown>(
      this.supplierPaymentsForm.controls['supplierpayment_nested']
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
            purchaseid: new FormControl(eee.purchaseid),
            supplierid: new FormControl(eee.supplierid),
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
            this.supplierPaymentsForm.get('supplierpayment_nested') as FormArray
          ).push(newControl);
        }
      });
    }

    const controlvalue = <FormArray><unknown>(this.supplierPaymentsForm.controls['supplierpayment_nested']);

    const nTotAmount = controlvalue.value?.reduce((acc: any, val: any) => (acc += Number(val.total_amount)), 0);

    this.supplierPaymentsForm.get('n_total_amount')?.setValue(String(nTotAmount.toFixed(2)));
  }

  getCommonControls(): AbstractControl[] {
    return (
      this.supplierPaymentsForm.get('supplierpayment_nested') as FormArray
    ).controls;
  }

  setDeduction(i: number, event: Event) {
    const checkbox = event.target as HTMLInputElement
    const isChecked = checkbox.checked;
    const control = <FormArray><unknown>(
      this.supplierPaymentsForm.controls['supplierpayment_nested']
    );
    const totalAmount = Number(control.at(i).get('total_amount')?.value);
    if (isChecked) {
      control.at(i).get('deduction_amount')?.setValue(String(totalAmount.toFixed(2)));
    } else {
      control.at(i).get('deduction_amount')?.setValue('0.00');
    }
  }

  getSupplierList() {
    this.sMSvc.getList(this.companyID).subscribe((res: any) => {
      this.supplierDetailsList = res;
      this.suggestions = res;
    });
  }

  suggest(value: any) {
    this.suggestions = this.supplierDetailsList.filter((item) =>
      item.supplier_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.supplierDetailsList;
  }

  async setSupplierDetails(id: any) {
    const newArray = this.supplierDetailsList.filter((e) => {
      return e.supplierid == id;
    });
    if (newArray.length > 0) {
      this.supplierPaymentsForm.get('supplierid')?.setValue(id);
      this.supplierPaymentsForm.get('balance')?.setValue(newArray[0].c_balance);
      this.advanceArrayList = await this.sMSvc.getAdvanceList(id).toPromise() || [];
      await this.getPaymentForSupplier(id);
      this.someMethod(); // Trigger change detection
    }
  }

  async setTwoDigitBalance() {
    const balanceControl = this.supplierPaymentsForm.get('adnp_amount');
    let value: string | number = balanceControl?.value || 0;

    // Ensure value is treated as string for parseFloat
    if (!isNaN(Number(value)) && value !== null && value !== '') {
      value = parseFloat(value.toString()).toFixed(2).toString();
      balanceControl?.setValue(value, { emitEvent: false });
    }
  }

  setAmountMode() {
    this.supplierPaymentsForm.get('n_amount')?.setValue('');
    this.supplierPaymentsForm.get('adnp_amount')?.setValue('0.00');
    this.supplierPaymentsForm.get('advanceid')?.setValue(0);
    this.deductionTotalAmount(this.supplierPaymentsForm.value.n_amount);
  }

  deductionTotalAmount(namv: any) {
    if (Number(namv) > Number(this.supplierPaymentsForm.value.n_total_amount)) {
      this.supplierPaymentsForm.get('n_amount')?.setValue('');
      this.notificationSvc.error('Amount is invalid');
    }
    const control = <FormArray><unknown>(
      this.supplierPaymentsForm.controls['supplierpayment_nested']
    );
    let amount = 0;
    amount = Number(this.supplierPaymentsForm.value.n_amount);
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
    const getAdvan = Number(this.advanceArrayList.find((e) => { return e.advanceid == this.supplierPaymentsForm.value.advanceid })?.aval_addvance || 0);
    await this.setTwoDigitBalance();
    debugger
    if (Number(naadv) > Number(this.supplierPaymentsForm.value.n_total_amount) || Number(naadv) > getAdvan) {
      this.supplierPaymentsForm.get('adnp_amount')?.setValue('0.00');
      this.notificationSvc.error('Amount is invalid');
    }
    const control = <FormArray><unknown>(
      this.supplierPaymentsForm.controls['supplierpayment_nested']
    );
    let amount = 0;
    amount = Number(this.supplierPaymentsForm.value.adnp_amount);
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
    if (this.supplierPaymentsForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        var value = this.supplierPaymentsForm.value;
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
      this.supplierPaymentsForm.markAllAsTouched();
      this.notificationSvc.error('Some required input are missing!');
    }
  }
  someMethod() {
    this.cdRef.detectChanges();
  }

  cancelClick() {
    this.supplierPaymentsForm.reset();
    const control = <FormArray><unknown>(this.supplierPaymentsForm.controls['supplierpayment_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.supplierPaymentsForm.get('paymentid')?.setValue(0);
    this.supplierPaymentsForm.get('supplierid')?.setValue(null);
    this.supplierPaymentsForm.get('date')?.setValue('');
    this.supplierPaymentsForm.get('balance')?.setValue('');
    this.supplierPaymentsForm.get('amount_mode')?.setValue('invoice');
    this.supplierPaymentsForm.get('payment_type')?.setValue('Cash');
    this.supplierPaymentsForm.get('cheque_no')?.setValue('');
    this.supplierPaymentsForm.get('c_date')?.setValue('');
    this.supplierPaymentsForm.get('c_amount')?.setValue('');
    this.supplierPaymentsForm.get('n_amount')?.setValue('');
    this.supplierPaymentsForm.get('adnp_amount')?.setValue('0.00');
    this.supplierPaymentsForm.get('advanceid')?.setValue(0);
    this.supplierPaymentsForm.get('n_total_amount')?.setValue('0.00');
    this.supplierPaymentsForm.get('cuid')?.setValue(this.userID);
    this.supplierPaymentsForm.get('companyid')?.setValue(this.companyID);
    this.getSupplierList();
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }
}
