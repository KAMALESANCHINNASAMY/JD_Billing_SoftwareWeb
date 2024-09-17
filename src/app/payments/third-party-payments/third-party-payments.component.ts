import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { thirdPartyPaymentService } from 'src/app/api-service/payment/thirdpartyPayment.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';

@Component({
  selector: 'app-third-party-payments',
  templateUrl: './third-party-payments.component.html',
  styleUrl: './third-party-payments.component.scss',
})
export class ThirdPartyPaymentsComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  suggestions: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  thirdPartyPurchaseList: any[] = [];
  advanceArrayList: any[] = [];
  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private tHMSVC: thirdPartyMasterService,
    private cdRef: ChangeDetectorRef,
    private TPPSVC: thirdPartyPaymentService
  ) { }

  async ngOnInit() {
    this.getThirdPartyList();
  }

  someMethod() {
    this.cdRef.detectChanges();
  }

  thirdPartyPaymentsForm = new FormGroup({
    third_partyid: new FormControl(0),
    paymentid: new FormControl(0),
    purchaseid: new FormControl(0),
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
    thirdPartyPayment_nested: new FormArray([]),
    companyid: new FormControl(this.companyID),
    cuid: new FormControl(this.userID),
  });

  getCommonControls(): AbstractControl[] {
    return (
      this.thirdPartyPaymentsForm.get('thirdPartyPayment_nested') as FormArray
    ).controls;
  }

  async setThirdPartyDetails(id: any) {
    const newArray = this.thirdPartyDetailsList.filter((e) => {
      return e.third_partyid == id;
    });
    if (newArray.length > 0) {
      this.thirdPartyPaymentsForm.get('third_partyid')?.setValue(id);
      this.thirdPartyPaymentsForm.get('balance')?.setValue(newArray[0].c_balance);
      this.advanceArrayList = await this.tHMSVC.getAdvanceList(id).toPromise() || [];
      await this.getPaymentForThirdParty(id);
      this.someMethod(); // Trigger change detection
    }
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.suggestions = res;
    });
  }

  setAmountMode() {
    this.thirdPartyPaymentsForm.get('n_amount')?.setValue('');
    this.thirdPartyPaymentsForm.get('adnp_amount')?.setValue('0.00');
    this.thirdPartyPaymentsForm.get('advanceid')?.setValue(0);
    this.deductionTotalAmount(this.thirdPartyPaymentsForm.value.n_amount);
  }

  deductionTotalAmount(namv: any) {
    if (Number(namv) > Number(this.thirdPartyPaymentsForm.value.n_total_amount)) {
      this.thirdPartyPaymentsForm.get('n_amount')?.setValue('');
    }
    const control = <FormArray><unknown>(this.thirdPartyPaymentsForm.controls['thirdPartyPayment_nested']);
    let amount = 0;
    amount = Number(this.thirdPartyPaymentsForm.value.n_amount);
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

  async setTwoDigitBalance() {
    const balanceControl = this.thirdPartyPaymentsForm.get('adnp_amount');
    let value: string | number = balanceControl?.value || 0;

    // Ensure value is treated as string for parseFloat
    if (!isNaN(Number(value)) && value !== null && value !== '') {
      value = parseFloat(value.toString()).toFixed(2).toString();
      balanceControl?.setValue(value, { emitEvent: false });
    }
  }

  async deductionAdvanceAmount(naadv: any) {
    debugger
    const getAdvan = Number(this.advanceArrayList.find((e) => { return e.advanceid == this.thirdPartyPaymentsForm.value.advanceid })?.aval_addvance || 0);
    await this.setTwoDigitBalance();
    debugger
    if (Number(naadv) > Number(this.thirdPartyPaymentsForm.value.n_total_amount) || Number(naadv) > getAdvan) {
      this.thirdPartyPaymentsForm.get('adnp_amount')?.setValue('0.00');
      this.notificationSvc.error('Amount is invalid');
    }
    const control = <FormArray><unknown>(
      this.thirdPartyPaymentsForm.controls['thirdPartyPayment_nested']
    );
    let amount = 0;
    amount = Number(this.thirdPartyPaymentsForm.value.adnp_amount);
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

  setDeduction(i: number, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    const control = <FormArray><unknown>(
      this.thirdPartyPaymentsForm.controls['thirdPartyPayment_nested']
    );
    const totalAmount = Number(control.at(i).get('total_amount')?.value);
    if (isChecked) {
      control.at(i).get('deduction_amount')?.setValue(String(totalAmount.toFixed(2)));
    } else {
      control.at(i).get('deduction_amount')?.setValue('0.00');
    }
  }

  suggest(value: any) {
    this.suggestions = this.thirdPartyDetailsList.filter((item) =>
      item.party_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.thirdPartyDetailsList;
  }

  async getPaymentForThirdParty(id: number): Promise<void> {
    const newPaymentList = await this.TPPSVC.getThirdPartyPaymentLists(id).toPromise();
    debugger
    const control = <FormArray><unknown>(
      this.thirdPartyPaymentsForm.controls['thirdPartyPayment_nested']
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
            third_partyid: new FormControl(eee.third_partyid),
            date: new FormControl(eee.date),
            invoice_no: new FormControl(eee.invoice_no),
            bill_no: new FormControl(eee.bill_no),
            total: new FormControl(String(eee.tot.toFixed(2))),
            ret_total: new FormControl(eee.retTot),
            total_amount: new FormControl(eee.totalcal.toFixed(2)),
            deduction_amount: new FormControl('0.00'),
            gst: new FormControl(eee.gst),
            non_gst: new FormControl(eee.non_gst),
            isbal: new FormControl(eee.isbal)
          });
          (this.thirdPartyPaymentsForm.get('thirdPartyPayment_nested') as FormArray).push(newControl);
        }
      });
    }

    const controlvalue = <FormArray><unknown>(
      this.thirdPartyPaymentsForm.controls['thirdPartyPayment_nested']
    );
    const nTotAmount = controlvalue.value?.reduce((acc: any, val: any) => (acc += Number(val.total_amount)), 0);

    this.thirdPartyPaymentsForm.get('n_total_amount')?.setValue(String(nTotAmount));
  }
  async save() {
    if (this.thirdPartyPaymentsForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        var value = this.thirdPartyPaymentsForm.value;
        this.TPPSVC.addNew(value).subscribe((res) => {
          if (res.status == 'Saved successfully') {
            this.notificationSvc.success('Saved Success');
            this.cancelClick();
          } else if (res.status == 'Alredy') {
            this.notificationSvc.warn(
              'Bill No already exists ! Please save it again'
            );
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
  cancelClick() {
    this.thirdPartyPaymentsForm.reset();
    const control = <FormArray><unknown>(
      this.thirdPartyPaymentsForm.controls['thirdPartyPayment_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.thirdPartyPaymentsForm.get('paymentid')?.setValue(0);
    this.thirdPartyPaymentsForm.get('purchaseid')?.setValue(0);
    this.thirdPartyPaymentsForm.get('third_partyid')?.setValue(null);
    this.thirdPartyPaymentsForm.get('date')?.setValue('');
    this.thirdPartyPaymentsForm.get('balance')?.setValue('');
    this.thirdPartyPaymentsForm.get('amount_mode')?.setValue('invoice');
    this.thirdPartyPaymentsForm.get('payment_type')?.setValue('Cash');
    this.thirdPartyPaymentsForm.get('cheque_no')?.setValue('');
    this.thirdPartyPaymentsForm.get('c_date')?.setValue('');
    this.thirdPartyPaymentsForm.get('c_amount')?.setValue('');
    this.thirdPartyPaymentsForm.get('n_total_amount')?.setValue('0');
    this.thirdPartyPaymentsForm.get('cuid')?.setValue(this.userID);
    this.thirdPartyPaymentsForm.get('companyid')?.setValue(this.companyID);
    this.thirdPartyPaymentsForm.get('adnp_amount')?.setValue('0.00');
    this.thirdPartyPaymentsForm.get('advanceid')?.setValue(0);

    this.getThirdPartyList();
  }
}
