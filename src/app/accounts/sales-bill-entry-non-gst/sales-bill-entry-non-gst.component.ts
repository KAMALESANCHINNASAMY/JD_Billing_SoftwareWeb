import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChangeDetectorRef, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { salesBillingService } from 'src/app/api-service/Accounts/salesBilling.service';
import { salesBillingServiceNonGST } from 'src/app/api-service/Accounts/salesBillingNonGST.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { brandMasterService } from 'src/app/api-service/brandMaster.service';
import { captchaDialogService } from 'src/app/api-service/captchaDialog.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { itemMasterService } from 'src/app/api-service/itemMaster.service';
import { salesBillNongstReportService } from 'src/app/api-service/reports/salesBillNongstReport.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-sales-bill-entry-non-gst',
  templateUrl: './sales-bill-entry-non-gst.component.html',
  styleUrl: './sales-bill-entry-non-gst.component.scss',
  providers: [DatePipe]
})
export class SalesBillEntryNonGstComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  customerDetailsList: any[] = [];
  suggestions: any[] = [];
  brandList: any[] = [];
  itemMasterList: any[] = [];
  newItemList: any[] = [];
  salesBillingNongstList: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);

  async ngOnInit() {
    this.getCustomerList();
    this.getBrandList();
    this.getItemMasterDetails();
    this.findBillNo();
    this.getSalesBillingNonGSTList(this.today);
  }

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private cMSvc: customerMasterService,
    private cdRef: ChangeDetectorRef,
    private bSvc: brandMasterService,
    private ITMSRC: itemMasterService,
    private sBSvc: salesBillingService,
    private sBNsvc: salesBillingServiceNonGST,
    private SBNOGSTREPSVC: salesBillNongstReportService,
    private capDialog: captchaDialogService,
    private datePipe: DatePipe
  ) { }

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

  getSalesBillingNonGSTList(dated: any) {
    this.sBNsvc
      .getSalesNonGSTList(this.companyID, dated)
      .subscribe((res: any) => {
        this.salesBillingNongstList = res;
        this.cdRef.detectChanges();
      });
  }

  suggest(value: any) {
    this.suggestions = this.customerDetailsList.filter((item) =>
      item.customer_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.customerDetailsList;
  }

  setCustomerDetails(id: any) {
    const newArray = this.customerDetailsList.filter((e) => {
      return e.customerid == id;
    });
    if (newArray.length > 0) {
      this.salesBillEntryForm.get('customerid')?.setValue(id);
      const Control = this.salesBillEntryForm.get(
        'sales_bill_nested'
      ) as FormArray;
      Control.value.forEach((element: any, i: number) => {
        this.colculation(i);
      });
      this.someMethod(); // Trigger change detection
    }
  }

  async getStockBySiCode(code: string, i: number) {
    const Control = this.salesBillEntryForm.get('sales_bill_nested') as FormArray;
    const alredyExArray = Control.value.filter((e: any, ii: number) => { return e.si_code === code && ii !== i });
    if (alredyExArray.length > 0) {
      Control.at(i).get('si_code')?.setValue('');
      this.notificationSvc.warn('The given Si code already exists');
      return;
    }
    const stockDetails = await this.sBSvc.getStockListBySi_code(this.companyID, code).toPromise();

    if (stockDetails?.length) {
      const Control = this.salesBillEntryForm.get(
        'sales_bill_nested'
      ) as FormArray;
      const element = stockDetails[0];
      const filteredItems = this.itemMasterList.filter((e) => {
        return e.brandid == element.brandid;
      });
      this.newItemList[element.brandid] = filteredItems;
      Control.at(i).get('stockid')?.setValue(element.stockid);
      Control.at(i).get('ref_code')?.setValue(element.ref_code);
      Control.at(i).get('brandid')?.setValue(element.brandid);
      Control.at(i).get('itemid')?.setValue(element.itemid);
      Control.at(i).get('hsn_number')?.setValue(element.hsn_number);
      Control.at(i).get('qty')?.setValue(element.qty);
      Control.at(i).get('isqty')?.setValue(element.qty);
      if (!element.hsn_number) {
        this.setHsn(i);
      }
    } else {
      this.notificationSvc.error('Invalid Si Code for active financial year !');
    }
  }

  setHsn(i: any) {
    const Control = this.salesBillEntryForm.get(
      'sales_bill_nested'
    ) as FormArray;
    const proID = Control.at(i).get('itemid')?.value;
    Control.at(i)
      .get('hsn_number')
      ?.setValue(
        this.itemMasterList.filter((e) => {
          return e.itemid == proID;
        })[0].hsn_number
      );
    this.colculation(i);
  }

  salesBillEntryForm = new FormGroup({
    entryid: new FormControl(0),
    customerid: new FormControl(null),
    date: new FormControl(''),
    bill_no: new FormControl(''),
    balance: new FormControl(''),
    credit_days: new FormControl(''),
    billing_address: new FormControl(''),
    shipping_address: new FormControl(''),
    total: new FormControl('', [Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
    sales_bill_nested: new FormArray([
      new FormGroup({
        entry_n_id: new FormControl(0),
        stockid: new FormControl(null),
        ref_code: new FormControl(''),
        si_code: new FormControl(''),
        brandid: new FormControl(null),
        itemid: new FormControl(null),
        hsn_number: new FormControl(''),
        price: new FormControl('', [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ]),
        discount: new FormControl('', [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ]),
        qty: new FormControl('', [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ]),
        total: new FormControl('', [Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
        isqty: new FormControl(''),
      }),
    ]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (this.salesBillEntryForm.get('sales_bill_nested') as FormArray)
      .controls;
  }

  changeInputTwoDigit(i: number): void {
    const control = this.salesBillEntryForm.get(
      'sales_bill_nested'
    ) as FormArray;
    const priceControl = control.at(i).get('price');

    let priceValue = priceControl?.value;

    // Remove non-numeric characters except dot
    priceValue = priceValue.replace(/[^0-9.]/g, '');

    // Format to two decimal places
    priceValue = parseFloat(priceValue).toFixed(2);

    // Update the form control value
    priceControl?.setValue(priceValue);

    if (priceValue.includes('..')) {
      return;
    }
  }

  getItemControl(index: number): FormControl {
    const control = (
      this.salesBillEntryForm.get('sales_bill_nested') as FormArray
    )
      .at(index)
      ?.get('itemid') as FormControl;
    return control;
  }

  isItemControlInvalid(index: number): boolean {
    const control = this.getItemControl(index);
    return control.touched && !!control.errors;
  }

  getPriceControl(index: number): FormControl {
    const control = (
      this.salesBillEntryForm.get('sales_bill_nested') as FormArray
    )
      .at(index)
      ?.get('price') as FormControl;
    return control;
  }

  isPriceControlInvalid(index: number): boolean {
    const control = this.getPriceControl(index);
    return control.touched && !!control.errors;
  }

  getDiscountControl(index: number): FormControl {
    const control = (
      this.salesBillEntryForm.get('sales_bill_nested') as FormArray
    )
      .at(index)
      ?.get('discount') as FormControl;
    return control;
  }

  isDiscountControlInvalid(index: number): boolean {
    const control = this.getDiscountControl(index);
    return control.touched && !!control.errors;
  }

  getQtyControl(index: number): FormControl {
    const control = (
      this.salesBillEntryForm.get('sales_bill_nested') as FormArray
    )
      .at(index)
      ?.get('qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }

  async findBillNo(): Promise<void> {
    this.sBNsvc.getMaxId(this.companyID).subscribe((data) => {
      let maxnumber = 0;
      if (data.length > 0) {
        maxnumber = data[0].entryid + 1;
        if (maxnumber < 10) {
          this.salesBillEntryForm.get('bill_no')?.setValue('0' + String(maxnumber));
        }
        else {
          this.salesBillEntryForm.get('bill_no')?.setValue(String(maxnumber));
        }
      }
    });
  }
  addNesForm() {
    const newControl = new FormGroup({
      entry_n_id: new FormControl(0),
      stockid: new FormControl(null),
      ref_code: new FormControl(''),
      si_code: new FormControl(''),
      brandid: new FormControl(null),
      itemid: new FormControl(null),
      hsn_number: new FormControl(''),
      price: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
      discount: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
      qty: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
      total: new FormControl('', [Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      isqty: new FormControl(''),
    });
    (this.salesBillEntryForm.get('sales_bill_nested') as FormArray).push(
      newControl
    );
    this.finalCalculation();
    this.someMethod(); // Trigger change detection
  }

  removeNesForm(index: number) {
    (this.salesBillEntryForm.get('sales_bill_nested') as FormArray).removeAt(
      index
    );

    this.finalCalculation();
    this.someMethod(); // Trigger change detection
  }

  colculation(i: any) {
    const Control = this.salesBillEntryForm.get(
      'sales_bill_nested'
    ) as FormArray;
    const price = Number(Control.at(i).get('price')?.value);
    const discount = Number(Control.at(i).get('discount')?.value);
    if (Number(discount) > 100) {
      Control.at(i).get('discount')?.setValue('');
    }
    if (
      Number(Control.at(i).get('qty')?.value) >
      Number(Control.at(i).get('isqty')?.value)
    ) {
      Control.at(i).get('qty')?.setValue(Control.at(i).get('isqty')?.value);
      this.notificationSvc.error('Invalid QTY!');
    }
    const disAmount = price - (price * discount) / 100;
    const qty = Number(Control.at(i).get('qty')?.value);
    Control.at(i).get('total')?.setValue(String((disAmount * qty).toFixed(2)));

    this.finalCalculation();
  }

  async finalCalculation() {
    const Control = this.salesBillEntryForm.get(
      'sales_bill_nested'
    ) as FormArray;
    const FormTotal = Control.value.reduce(
      (acc: any, val: any) => (acc += Number(val.total)),
      0
    );
    this.salesBillEntryForm.get('total')?.setValue(String(FormTotal.toFixed(2)));
  }

  async save() {
    if (this.salesBillEntryForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.salesBillEntryForm.value;
        this.sBNsvc.addNew(value).subscribe((res) => {
          if (res.status == 'Saved successfully') {
            this.notificationSvc.success('Saved Success');
            this.cancelClick();
          } else if (res.status == 'Alredy') {
            this.notificationSvc.warn(
              'Bill No or Invoice No already exists ! Please save it again'
            );
          } else {
            this.notificationSvc.error('Something error');
          }
        });
      }
    } else {
      this.salesBillEntryForm.markAllAsTouched();
      this.notificationSvc.error('Some required input are missing!');
    }
  }

  async update(item: any) {
    const nestedArray = await this.sBNsvc.getSalesNonGSTNestedList(item.entryid).toPromise();
    const control = <FormArray>(
      this.salesBillEntryForm.controls['sales_bill_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.salesBillEntryForm.patchValue(item);
      this.salesBillEntryForm.get('cuid')?.setValue(this.userID);

      nestedArray?.forEach(async (e, i) => {
        const filteredItems = this.itemMasterList.filter(
          (ee) => ee.brandid == e.brandid
        );
        // Assign filtered list to newItemList for the corresponding index
        if (filteredItems && filteredItems.length > 0) {
          this.newItemList[e.brandid] = filteredItems;
        }
        const newControl = new FormGroup({
          entry_n_id: new FormControl(e.entry_n_id),
          stockid: new FormControl(e.stockid),
          ref_code: new FormControl(e.ref_code),
          si_code: new FormControl(e.si_code),
          brandid: new FormControl(e.brandid),
          itemid: new FormControl(e.itemid),
          hsn_number: new FormControl(e.hsn_number),
          price: new FormControl(e.price, [
            Validators.required,
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
          ]),
          discount: new FormControl(e.discount, [
            Validators.required,
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
          ]),
          qty: new FormControl(e.qty, [
            Validators.required,
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
          ]),
          total: new FormControl(e.total, [Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
          isqty: new FormControl(e.qty),
        });
        (this.salesBillEntryForm.get('sales_bill_nested') as FormArray).push(
          newControl
        );
        this.someMethod();
      });
    }
    this.scrollToTableTop();
  }

  deleteFun(id: number) {
    this.capDialog.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.sBNsvc.delete(id).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  async getReport(entryid: any) {
    const multipleSalesNongstList = await this.sBNsvc.getMultipleSalesReport(entryid)
      .toPromise();
    this.SBNOGSTREPSVC.openConfirmDialog(multipleSalesNongstList)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
        }
      });
  }

  cancelClick() {
    this.salesBillEntryForm.reset();
    const control = <FormArray>(
      this.salesBillEntryForm.controls['sales_bill_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.salesBillEntryForm.get('entryid')?.setValue(0);
    this.salesBillEntryForm.get('customerid')?.setValue(null);
    this.salesBillEntryForm.get('date')?.setValue('');
    this.salesBillEntryForm.get('bill_no')?.setValue('');
    this.salesBillEntryForm.get('balance')?.setValue('');
    this.salesBillEntryForm.get('credit_days')?.setValue('');
    this.salesBillEntryForm.get('billing_address')?.setValue('');
    this.salesBillEntryForm.get('shipping_address')?.setValue('');
    this.salesBillEntryForm.get('total')?.setValue('');
    this.salesBillEntryForm.get('cuid')?.setValue(this.userID);
    this.salesBillEntryForm.get('companyid')?.setValue(this.companyID);

    this.addNesForm();
    this.getCustomerList();
    this.findBillNo();
    this.getSalesBillingNonGSTList(this.today);
  }

  getFormattedDate(dateString: string): string | null {
    if (dateString) {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'dd-MM-yyyy');
    } else {
      return '';
    }
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
