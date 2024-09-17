import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { salesBillingServiceNonGST } from 'src/app/api-service/Accounts/salesBillingNonGST.service';
import { salesBillingReturnDebitNonGstService } from 'src/app/api-service/Credit-Debit-note/salesBillingReturnDebitNongst.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { brandMasterService } from 'src/app/api-service/brandMaster.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { itemMasterService } from 'src/app/api-service/itemMaster.service';
import { salesBillNongstReturnReportService } from 'src/app/api-service/reports/salesBillNongstReturnReport.service';

@Component({
  selector: 'app-sales-bill-entry-debitnote',
  templateUrl: './sales-bill-entry-debitnote.component.html',
  styleUrl: './sales-bill-entry-debitnote.component.scss'
})
export class SalesBillEntryDebitnoteComponent implements OnInit {

  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  customerDetailsList: any[] = [];
  suggestions: any[] = [];
  brandList: any[] = [];
  itemMasterList: any[] = [];
  newItemList: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  salesBillingNongstDebitList: any[] = [];

  billNoList: any[] = [];
  billNoSuggestions: any[] = [];

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private cMSvc: customerMasterService,
    private cdRef: ChangeDetectorRef,
    private bSvc: brandMasterService,
    private ITMSRC: itemMasterService,
    private SBRDNGSVC: salesBillingReturnDebitNonGstService,
    private SBNGSTRRSVC: salesBillNongstReturnReportService,
    private sBNsvc: salesBillingServiceNonGST,
  ) { }

  ngOnInit() {
    this.findBillNo();
    this.getCustomerList();
    this.getBrandList();
    this.getItemMasterDetails();
    this.getSalesBillingNongstDebitList(this.today);
    this.salesBillReturnNonGSTDebitForm.get('return_date')?.setValue(this.today);
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

  suggest(value: any) {
    this.suggestions = this.customerDetailsList.filter((item) =>
      item.customer_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.customerDetailsList;
  }

  async setCustomerDetails(id: any) {
    this.billNoList = [];
    this.billNoSuggestions = [];
    this.salesBillReturnNonGSTDebitForm.get('entryid')?.setValue(null);
    const getBillList = await this.SBRDNGSVC.getSalesBillingByCustomerID(id, this.companyID).toPromise();
    this.billNoList = getBillList || [];
    this.billNoSuggestions = getBillList || [];
  }

  Billsuggest(value: any) {
    this.billNoSuggestions = this.billNoList.filter((item) =>
      item.bill_no.toLowerCase().includes(value.toLowerCase())
    );
    if (this.billNoSuggestions.length < 1)
      this.billNoSuggestions = this.billNoList;
  }

  getSalesBillingNongstDebitList(dated: any) {
    this.salesBillingNongstDebitList = [];
    this.SBRDNGSVC.getSalesBillingNongstDebitList(this.companyID, dated).subscribe(
      (res: any) => {
        this.salesBillingNongstDebitList = res;
        this.cdRef.detectChanges();
      }
    );
  }

  async setSalesDetails(value: number) {
    const nestedArray = await this.sBNsvc.getSalesNonGSTNestedList(value).toPromise();
    const control = <FormArray><unknown>(this.salesBillReturnNonGSTDebitForm.controls['sales_billReturnDebit_nested']);
    if (nestedArray?.length != 0) {
      while (control.length !== 0) {
        control.removeAt(0);
      }
      if (control.length == 0) {
        const formVal = this.billNoList.filter((e) => { return e.entryid == value });
        this.salesBillReturnNonGSTDebitForm.get('bill_date')?.setValue(formVal[0].date);
        this.salesBillReturnNonGSTDebitForm.get('total')?.setValue(formVal[0].total);
        this.salesBillReturnNonGSTDebitForm.get('invoice_no')?.setValue(formVal[0].bill_no);

        nestedArray?.forEach(async (e) => {
          const filteredItems = this.itemMasterList.filter((ee) => ee.brandid == e.brandid);
          if (filteredItems && filteredItems.length > 0) {
            this.newItemList[e.brandid] = filteredItems;
          }
          const newControl = new FormGroup({
            returndebit_n_id: new FormControl(0),
            returndebit_id: new FormControl(0),
            entry_n_id: new FormControl(e.entry_n_id),
            entryid: new FormControl(e.entryid),
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
          (this.salesBillReturnNonGSTDebitForm.get('sales_billReturnDebit_nested') as FormArray).push(
            newControl
          );
          this.someMethod();
        });
      }
    }
  }

  async findBillNo(): Promise<void> {
    const data: any = await this.SBRDNGSVC.getMaxId(this.companyID).toPromise();
    let maxnumber = 0;
    if (data.length > 0 && this.salesBillReturnNonGSTDebitForm.value.returndebit_id == 0) {
      maxnumber = data[0].entryid + 1;
      if (maxnumber < 10) {
        this.salesBillReturnNonGSTDebitForm.get('return_no')?.setValue('0' + String(maxnumber));
      }
      else {
        this.salesBillReturnNonGSTDebitForm.get('return_no')?.setValue(String(maxnumber));
      }
    }
  }

  salesBillReturnNonGSTDebitForm = new FormGroup({
    returndebit_id: new FormControl(0),
    entryid: new FormControl(0),
    customerid: new FormControl(null),
    bill_date: new FormControl(''),
    invoice_no: new FormControl(''),
    invoice_date: new FormControl(''),
    return_no: new FormControl(''),
    return_date: new FormControl(''),
    return_total: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    total: new FormControl(''),
    sales_billReturnDebit_nested: new FormArray([
      // new FormGroup({
      //   returndebit_n_id: new FormControl(0),
      //   returndebit_id: new FormControl(0),
      //   entry_n_id: new FormControl(0),
      //   entryid: new FormControl(0),
      //   ref_code: new FormControl(''),
      //   si_code: new FormControl(''),
      //   brandid: new FormControl(null),
      //   itemid: new FormControl(null),
      //   hsn_number: new FormControl(''),
      //   price: new FormControl('', [
      //     Validators.required,
      //     Validators.pattern(/^\d+(\.\d{1,2})?$/),
      //   ]),
      //   discount: new FormControl('', [
      //     Validators.required,
      //     Validators.pattern(/^\d+(\.\d{1,2})?$/),
      //   ]),
      //   qty: new FormControl('', [
      //     Validators.required,
      //     Validators.pattern(/^\d+(\.\d{1,2})?$/),
      //   ]),
      //   return_qty: new FormControl('', [
      //     Validators.required,
      //     Validators.pattern(/^\d+(\.\d{1,2})?$/),
      //   ]),
      //   isqty: new FormControl(''),
      //   total: new FormControl(''),
      //   return_total: new FormControl('')
      // }),
    ]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (
      this.salesBillReturnNonGSTDebitForm.get(
        'sales_billReturnDebit_nested'
      ) as FormArray
    ).controls;
  }

  getQtyControl(index: number): FormControl {
    const control = (
      this.salesBillReturnNonGSTDebitForm.get(
        'sales_billReturnDebit_nested'
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
    const control = (
      this.salesBillReturnNonGSTDebitForm.get(
        'sales_billReturnDebit_nested'
      ) as FormArray
    )
      .at(index)
      ?.get('si_code') as FormControl;
    return control;
  }

  isSiCodeControlInvalid(index: number): boolean {
    const control = this.getSiCodeControl(index);
    return control.touched && !!control.errors;
  }

  async finalCalculation() {
    const Control = this.salesBillReturnNonGSTDebitForm.get(
      'sales_billReturnDebit_nested'
    ) as FormArray;
    const FormTotal = Control.value.reduce(
      (acc: any, val: any) => (acc += Number(val.total)),
      0
    );
    this.salesBillReturnNonGSTDebitForm.get('total')?.setValue(String(FormTotal.toFixed(2)));
    const FormReturnTotal = Control.value.reduce(
      (acc: any, val: any) => (acc += Number(val.return_total)), 0
    );
    this.salesBillReturnNonGSTDebitForm.get('return_total')?.setValue(String(FormReturnTotal.toFixed(2)));
  }

  colculation(i: any) {
    const Control = this.salesBillReturnNonGSTDebitForm.get(
      'sales_billReturnDebit_nested'
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
      Control.at(i)
        .get('return_qty')
        ?.setValue(Control.at(i).get('qty')?.value);
      this.notificationSvc.error('Invalid QTY!');
    }

    const disAmount = price - (price * discount) / 100;
    const qty = Number(Control.at(i).get('return_qty')?.value);
    Control.at(i).get('return_total')?.setValue(String((disAmount * qty).toFixed(2)));

    this.finalCalculation();
  }

  async save() {
    if (this.salesBillReturnNonGSTDebitForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.salesBillReturnNonGSTDebitForm.value;
        this.SBRDNGSVC.addNew(value).subscribe((res) => {
          if (res.status == 'Saved successfully') {
            this.notificationSvc.success('Saved Success');
            this.cancelClick();
          } else if (res.status == 'Alredy') {
            this.notificationSvc.warn(
              'Bill No or Invoice No already exists !'
            );
          } else {
            this.notificationSvc.error('Something error');
          }
        });
      }
    } else {
      this.salesBillReturnNonGSTDebitForm.markAllAsTouched();
      this.notificationSvc.error('Some required input are missing!');
    }
  }

  async getReport(item: any) {
    const nestedArray = await this.SBRDNGSVC
      .getSalesBillingNongstDebitNestedList(item.returndebit_id)
      .toPromise();
    this.SBNGSTRRSVC.openConfirmDialog(item, nestedArray)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
        }
      });
  }

  async update(item: any) {
    await this.cancelClick();
    await this.setCustomerDetails(item.customerid);
    const nestedArray = await this.SBRDNGSVC.getSalesBillingNongstDebitNestedList(
      item.returndebit_id
    ).toPromise();
    const control = <FormArray><unknown>(
      this.salesBillReturnNonGSTDebitForm.controls['sales_billReturnDebit_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.salesBillReturnNonGSTDebitForm.patchValue(item);
      this.salesBillReturnNonGSTDebitForm.get('cuid')?.setValue(this.userID);

      nestedArray?.forEach(async (e, i) => {
        const filteredItems = this.itemMasterList.filter(
          (ee) => ee.brandid == e.brandid
        );
        // Assign filtered list to newItemList for the corresponding index
        if (filteredItems && filteredItems.length > 0) {
          this.newItemList[e.brandid] = filteredItems;
        }
        const newControl = new FormGroup({
          returndebit_n_id: new FormControl(e.returndebit_n_id),
          entry_n_id: new FormControl(e.entry_n_id),
          ref_code: new FormControl(e.ref_code),
          si_code: new FormControl(e.si_code),
          brandid: new FormControl(e.brandid),
          itemid: new FormControl(e.itemid),
          hsn_number: new FormControl(e.hsn_number),
          price: new FormControl(e.price),
          discount: new FormControl(e.discount),
          qty: new FormControl(e.qty),
          return_qty: new FormControl(e.return_qty),
          total: new FormControl(e.total),
          return_total: new FormControl(e.return_total)
        });
        (
          this.salesBillReturnNonGSTDebitForm.get(
            'sales_billReturnDebit_nested'
          ) as FormArray
        ).push(newControl);
        this.someMethod();
      });
    }
  }
  async cancelClick() {
    this.salesBillReturnNonGSTDebitForm.reset();
    const control = <FormArray><unknown>(
      this.salesBillReturnNonGSTDebitForm.controls['sales_billReturnDebit_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }
    this.salesBillReturnNonGSTDebitForm.get('returndebit_id')?.setValue(0);
    this.salesBillReturnNonGSTDebitForm.get('customerid')?.setValue(null);
    this.salesBillReturnNonGSTDebitForm.get('bill_date')?.setValue('');
    this.salesBillReturnNonGSTDebitForm.get('invoice_no')?.setValue('');
    this.salesBillReturnNonGSTDebitForm.get('invoice_date')?.setValue('');
    this.salesBillReturnNonGSTDebitForm.get('return_no')?.setValue('');
    this.salesBillReturnNonGSTDebitForm.get('return_date')?.setValue(this.today);
    this.salesBillReturnNonGSTDebitForm.get('return_total')?.setValue('');
    this.salesBillReturnNonGSTDebitForm.get('total')?.setValue('');
    this.salesBillReturnNonGSTDebitForm.get('cuid')?.setValue(this.userID);
    this.salesBillReturnNonGSTDebitForm.get('companyid')?.setValue(this.companyID);

    this.getCustomerList();
    this.getSalesBillingNongstDebitList(this.today);
    this.findBillNo();
  }
}
