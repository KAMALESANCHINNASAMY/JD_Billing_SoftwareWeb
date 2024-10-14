import { ThirdPartyPurchaseNonGstDebitService } from './../../api-service/Credit-Debit-note/thirdPartyNonGstpurchaseDebit.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { thirdPartyPurchaseService } from 'src/app/api-service/Accounts/thirdPartyPurchase.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { brandMasterService } from 'src/app/api-service/brandMaster.service';
import { itemMasterService } from 'src/app/api-service/itemMaster.service';
import { ThirdPartyPurchaseNongstReturnReportService } from 'src/app/api-service/reports/thirdPartyNongstPurchaseReturnReport.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';

@Component({
  selector: 'app-third-party-sarees-debit-note',
  templateUrl: './third-party-sarees-debit-note.component.html',
  styleUrl: './third-party-sarees-debit-note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThirdPartySareesDebitNoteComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  suggestions: any[] = [];
  brandList: any[] = [];
  itemMasterList: any[] = [];
  newItemList: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  ThirdPartyPurchaseNonGstDebitList: any[] = [];
  billNoList: any[] = [];
  billNoSuggestionList: any[] = [];

  ngOnInit() {
    this.findBillNo();
    this.getThirdPartyList();
    this.getBrandList();
    this.getItemMasterDetails();
    this.getThirdPartyNongstpurchaseDebitList(this.today);
    this.thirdPartyNonGstDebitForm.get('return_date')?.setValue(this.today);
  }

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private tHMSVC: thirdPartyMasterService,
    private bSvc: brandMasterService,
    private ITMSRC: itemMasterService,
    private cdRef: ChangeDetectorRef,
    private TPNGSTDSVC: ThirdPartyPurchaseNonGstDebitService,
    private TPNGSTRRSVC: ThirdPartyPurchaseNongstReturnReportService,
    private tPPSvc: thirdPartyPurchaseService,
  ) { }

  getBrandList() {
    this.bSvc.getList(this.companyID).subscribe((res: any) => {
      this.brandList = res;
    });
  }

  getItemMasterDetails() {
    this.ITMSRC.getItemMasterList(this.companyID).subscribe((res) => {
      this.itemMasterList = res;
    });
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

  suggest(value: any) {
    this.suggestions = this.thirdPartyDetailsList.filter((item) =>
      item.party_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.thirdPartyDetailsList;
  }

  async setThirdPartyDetails(id: any) {
    this.billNoList = [];
    this.billNoSuggestionList = [];
    this.thirdPartyNonGstDebitForm.get('purchaseid')?.setValue(null);
    const newPurchaseList = await this.TPNGSTDSVC.getNonGSTPurchasebythirdpartyid(id, this.companyID).toPromise();
    this.billNoList = newPurchaseList || [];
    this.billNoSuggestionList = newPurchaseList || [];
  }

  Billsuggest(value: string) {
    this.billNoSuggestionList = this.billNoList.filter((item) =>
      item.bill_no.toLowerCase().includes(value.toLowerCase())
    );
    if (this.billNoSuggestionList.length < 1)
      this.billNoSuggestionList = this.billNoList;
  }

  getThirdPartyNongstpurchaseDebitList(dated: any) {
    this.TPNGSTDSVC.getThirdPartyNonGstDebitList(this.companyID, dated).subscribe(
      (res: any) => {
        this.ThirdPartyPurchaseNonGstDebitList = res;
        this.cdRef.detectChanges();
      }
    );
  }

  async setNested(id: number) {
    this.thirdPartyNonGstDebitForm.get('purchase_date')?.setValue('');
    this.thirdPartyNonGstDebitForm.get('total')?.setValue('');
    const nestedArray = await this.tPPSvc.getThirdPartyPurchaseNestedLists(id).toPromise();

    const control = <FormArray><unknown>(this.thirdPartyNonGstDebitForm.controls['thirdPartyNonGst_Debit_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      const formEle = this.billNoList.filter((e) => { return e.purchaseid == id });
      this.thirdPartyNonGstDebitForm.get('purchase_date')?.setValue(formEle[0].date);
      this.thirdPartyNonGstDebitForm.get('total')?.setValue(formEle[0].total);

      nestedArray?.forEach(async (e, i) => {
        const filteredItems = this.itemMasterList.filter((ee) => ee.brandid == e.brandid);
        if (filteredItems && filteredItems.length > 0) {
          this.newItemList[e.brandid] = filteredItems;
        }
        const newControl = new FormGroup({
          thirdPartyDebit_n_id: new FormControl(0),
          purchase_n_id: new FormControl(e.purchase_n_id),
          purchaseid: new FormControl(e.purchaseid),
          ref_code: new FormControl(e.ref_code),
          si_code: new FormControl(e.si_code),
          brandid: new FormControl(e.brandid),
          itemid: new FormControl(e.itemid),
          hsn_number: new FormControl(e.hsn_number),
          price: new FormControl(e.price),
          discount: new FormControl(e.discount),
          qty: new FormControl(e.qty),
          return_qty: new FormControl('', [
            Validators.required,
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
          ]),
          total: new FormControl(e.total),
          return_total: new FormControl('')
        });
        (
          this.thirdPartyNonGstDebitForm.get(
            'thirdPartyNonGst_Debit_nested'
          ) as FormArray
        ).push(newControl);
        this.someMethod();
      });
    }
  }

  getQtyControl(index: number): FormControl {
    const control = (
      this.thirdPartyNonGstDebitForm.get(
        'thirdPartyNonGst_Debit_nested'
      ) as FormArray
    )
      .at(index)
      ?.get('return_qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }

  getSiCodeControl(index: number): FormControl {
    const control = (this.thirdPartyNonGstDebitForm.get('thirdPartyNonGst_Debit_nested') as FormArray).at(index)?.get('si_code') as FormControl;
    return control;
  }

  isSiCodeControlInvalid(index: number): boolean {
    const control = this.getSiCodeControl(index);
    return control.touched && !!control.errors;
  }

  async findBillNo(): Promise<void> {
    const data: any =await this.TPNGSTDSVC.getMaxId(this.companyID).toPromise();
    let maxnumber = 0;
    if (Number(data.length) > 0 && this.thirdPartyNonGstDebitForm.value.thirdPartyDebitid == 0) {
      maxnumber = data[0].entryid + 1;
      if (maxnumber < 10) {
        this.thirdPartyNonGstDebitForm.get('return_no')?.setValue('0' + String(maxnumber));
      } else {
        this.thirdPartyNonGstDebitForm.get('return_no')?.setValue(String(maxnumber));
      }
    }
  }

  thirdPartyNonGstDebitForm = new FormGroup({
    thirdPartyDebitid: new FormControl(0),
    purchaseid: new FormControl(0),
    third_partyid: new FormControl(null),
    purchase_date: new FormControl(''),
    invoice_no: new FormControl(''),
    invoice_date: new FormControl(''),
    return_no: new FormControl(''),
    return_date: new FormControl(''),
    total: new FormControl(''),
    return_total: new FormControl(''),
    thirdPartyNonGst_Debit_nested: new FormArray([
      // new FormGroup({
      //   thirdPartyDebit_n_id: new FormControl(0),
      //   purchase_n_id: new FormControl(0),
      //   purchaseid: new FormControl(0),
      //   thirdPartyDebitid: new FormControl(0),
      //   si_code: new FormControl(''),
      //   ref_code: new FormControl(''),
      //   brandid: new FormControl(null),
      //   itemid: new FormControl(null),
      //   hsn_number: new FormControl(''),
      //   price: new FormControl(''),
      //   discount: new FormControl(''),
      //   qty: new FormControl(''),
      //   return_qty: new FormControl('', [
      //     Validators.required,
      //     Validators.pattern(/^\d+(\.\d{1,2})?$/),
      //   ]),
      //   total: new FormControl(''),
      //   return_total: new FormControl('', [
      //     Validators.required,
      //     Validators.pattern(/^\d+(\.\d{1,2})?$/),
      //   ])
      // }),
    ]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (this.thirdPartyNonGstDebitForm.get('thirdPartyNonGst_Debit_nested') as FormArray).controls;
  }
  someMethod() {
    this.cdRef.detectChanges();
  }

  async finalCalculation() {
    const Control = this.thirdPartyNonGstDebitForm.get('thirdPartyNonGst_Debit_nested') as FormArray;
    const FormTotal = Control.value.reduce((acc: any, val: any) => (acc += Number(val.total)), 0);
    this.thirdPartyNonGstDebitForm.get('total')?.setValue(String(FormTotal.toFixed(2)));

    const FormReturnTotal = Control.value.reduce(
      (acc: any, val: any) => (acc += Number(val.return_total)), 0
    )
    this.thirdPartyNonGstDebitForm.get('return_total')?.setValue(String(FormReturnTotal.toFixed(2)));
  }

  colculation(i: any) {
    const Control = this.thirdPartyNonGstDebitForm.get(
      'thirdPartyNonGst_Debit_nested'
    ) as FormArray;
    const price = Number(Control.at(i).get('price')?.value);
    const discount = Number(Control.at(i).get('discount')?.value);
    if (Number(discount) > 100) {
      Control.at(i).get('discount')?.setValue('');
    }
    if (
      Number(Control.at(i).get('return_qty')?.value) >
      Number(Control.at(i).get('qty')?.value)
    ) {
      Control.at(i).get('return_qty')?.setValue(Control.at(i).get('qty')?.value);
      this.notificationSvc.error('Invalid QTY!');
    }

    const disAmount = price - (price * discount) / 100;
    const qty = Number(Control.at(i).get('return_qty')?.value);
    Control.at(i).get('return_total')?.setValue(String((disAmount * qty).toFixed(2)));

    this.finalCalculation();
  }

  async save() {
    if (this.thirdPartyNonGstDebitForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog('Are you sure want to add this record ?')
        .afterClosed()
        .toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.thirdPartyNonGstDebitForm.value;
        this.TPNGSTDSVC.addNew(value).subscribe((res) => {
          if (res.status == 'Saved successfully') {
            this.notificationSvc.success('Saved Success');
            this.cancelClick();
          } else if (res.status == 'Alredy') {
            this.notificationSvc.warn('Bill No or Invoice No already exists!');
          } else {
            this.notificationSvc.error('Something error');
          }
        });
      }
    } else {
      this.thirdPartyNonGstDebitForm.markAllAsTouched();
      this.notificationSvc.error('Some required input are missing!');
    }
  }

  async getReport(item: any) {
    const nestedArray = await this.TPNGSTDSVC.getThirdPartyNonGstDebitNestedList(item.thirdPartyDebitid).toPromise();
    this.TPNGSTRRSVC.openConfirmDialog(item, nestedArray).afterClosed().subscribe((res) => {
      if (res == true) {
      }
    });
  }

  async update(item: any) {
    await this.cancelClick();
    const nestedArray = await this.TPNGSTDSVC.getThirdPartyNonGstDebitNestedList(item.thirdPartyDebitid).toPromise();
    const control = <FormArray><unknown>(this.thirdPartyNonGstDebitForm.controls['thirdPartyNonGst_Debit_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.thirdPartyNonGstDebitForm.patchValue(item);
      this.thirdPartyNonGstDebitForm.get('cuid')?.setValue(this.userID);

      nestedArray?.forEach(async (e, i) => {
        const filteredItems = this.itemMasterList.filter(
          (ee) => ee.brandid == e.brandid
        );
        // Assign filtered list to newItemList for the corresponding index
        if (filteredItems && filteredItems.length > 0) {
          this.newItemList[e.brandid] = filteredItems;
        }
        const newControl = new FormGroup({
          thirdPartyDebit_n_id: new FormControl(e.thirdPartyDebit_n_id),
          purchase_n_id: new FormControl(e.purchase_n_id),
          purchaseid: new FormControl(e.purchaseid),
          ref_code: new FormControl(e.ref_code),
          si_code: new FormControl(e.si_code),
          brandid: new FormControl(e.brandid),
          itemid: new FormControl(e.itemid),
          hsn_number: new FormControl(e.hsn_number),
          price: new FormControl(e.price),
          discount: new FormControl(e.discount),
          qty: new FormControl(e.qty),
          return_qty: new FormControl(e.return_qty, [
            Validators.required,
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
          ]),
          total: new FormControl(e.total),
          return_total: new FormControl(e.return_total)
        });
        (
          this.thirdPartyNonGstDebitForm.get(
            'thirdPartyNonGst_Debit_nested'
          ) as FormArray
        ).push(newControl);
        this.someMethod();
      });
    }
  }
  async cancelClick() {
    this.thirdPartyNonGstDebitForm.reset();
    const control = <FormArray><unknown>(
      this.thirdPartyNonGstDebitForm.controls['thirdPartyNonGst_Debit_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }
    this.thirdPartyNonGstDebitForm.get('thirdPartyDebitid')?.setValue(0);
    this.thirdPartyNonGstDebitForm.get('third_partyid')?.setValue(null);
    this.thirdPartyNonGstDebitForm.get('purchase_date')?.setValue('');
    this.thirdPartyNonGstDebitForm.get('invoice_no')?.setValue('');
    this.thirdPartyNonGstDebitForm.get('invoice_date')?.setValue('');
    this.thirdPartyNonGstDebitForm.get('return_no')?.setValue('');
    this.thirdPartyNonGstDebitForm.get('return_date')?.setValue(this.today);
    this.thirdPartyNonGstDebitForm.get('total')?.setValue('');
    this.thirdPartyNonGstDebitForm.get('return_total')?.setValue('');
    this.thirdPartyNonGstDebitForm.get('cuid')?.setValue(this.userID);
    this.thirdPartyNonGstDebitForm.get('companyid')?.setValue(this.companyID);

    this.getThirdPartyList();
    this.getThirdPartyNongstpurchaseDebitList(this.today);
    this.findBillNo();
  }

}
