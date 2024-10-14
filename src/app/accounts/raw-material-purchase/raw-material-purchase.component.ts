import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { SupplierMasterService } from 'src/app/api-service/supplierMaster.service';
import { ChangeDetectorRef } from '@angular/core';
import { brandMasterService } from 'src/app/api-service/brandMaster.service';
import { itemMasterService } from 'src/app/api-service/itemMaster.service';
import { rawMaterialPurchaseService } from 'src/app/api-service/Accounts/materialPurchase.service';
import { financialYearService } from 'src/app/api-service/financialYear.service';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-raw-material-purchase',
  templateUrl: './raw-material-purchase.component.html',
  styleUrl: './raw-material-purchase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawMaterialPurchaseComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  supplierDetailsList: any[] = [];
  suggestions: any[] = [];
  brandList: any[] = [];
  itemMasterList: any[] = [];
  newItemList: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  rawMaterialList: any[] = [];
  ActiveFinYr: any[] = [];
  rawMaterialListAll: any[] = [];

  async ngOnInit() {
    await this.getActiveFinYr();
    this.getSupplierList();
    this.getBrandList();
    this.getItemMasterDetails();
    this.findBillNo();
    this.getRawMAtrialList(this.today);
  }

  constructor(
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private router: Router,
    private sMSvc: SupplierMasterService,
    private cdRef: ChangeDetectorRef,
    private bSvc: brandMasterService,
    private ITMSRC: itemMasterService,
    private rMPSvc: rawMaterialPurchaseService,
    private FINYRSVC: financialYearService
  ) { }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getRawMAtrialList(dated: any) {
    this.rMPSvc
      .getRawMAtrialLists(this.companyID, dated)
      .subscribe((res: any) => {
        this.rawMaterialList = res;
        this.cdRef.detectChanges();
      });
  }

  getActiveFinYr() {
    this.FINYRSVC.getActiveFinYear(this.companyID).subscribe((res: any) => {
      this.ActiveFinYr = res;
    });
  }

  getSupplierList() {
    this.supplierDetailsList = [];
    this.suggestions = [];
    this.sMSvc.getList(this.companyID).subscribe((res: any) => {
      this.supplierDetailsList = res;
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
    this.suggestions = this.supplierDetailsList.filter((item) =>
      item.supplier_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.supplierDetailsList;
  }

  someMethod() {
    this.cdRef.detectChanges();
  }

  setSupplierDetails(id: any) {
    const newArray = this.supplierDetailsList.filter((e) => {
      return e.supplierid == id;
    });
    if (newArray.length > 0) {
      this.rawMaterialPurchaseForm.get('supplierid')?.setValue(id);
      this.rawMaterialPurchaseForm.get('gst_in')?.setValue(newArray[0].gst_in);
      this.rawMaterialPurchaseForm
        .get('c_balance')
        ?.setValue(newArray[0].c_balance);

      const Control = this.rawMaterialPurchaseForm.get(
        'purchase_nested'
      ) as FormArray;
      Control.value.forEach((element: any, i: number) => {
        this.colculation(i);
      });
      this.someMethod(); // Trigger change detection
    }
  }

  async findBillNo(): Promise<void> {
    this.rMPSvc.getMaxId(this.companyID).subscribe((data) => {
      let maxnumber = 0;
      if (data.length > 0) {
        maxnumber = data[0].purchaseid + 1;
        if (maxnumber < 10) {
          this.rawMaterialPurchaseForm
            .get('bill_no')
            ?.setValue('0' + String(maxnumber));
        }
        else {
          this.rawMaterialPurchaseForm
            .get('bill_no')
            ?.setValue(String(maxnumber));
        }
      }
    });
  }

  rawMaterialPurchaseForm = new FormGroup({
    purchaseid: new FormControl(0),
    supplierid: new FormControl(null),
    date: new FormControl(''),
    supplier_bill_no: new FormControl(''),
    bill_no: new FormControl(''),
    gst_in: new FormControl(''),
    c_balance: new FormControl(''),
    credit_days: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
    ]),
    total: new FormControl(''),
    purchase_nested: new FormArray([
      new FormGroup({
        purchase_n_id: new FormControl(0),
        brandid: new FormControl(null),
        itemid: new FormControl(null),
        hsn_number: new FormControl(''),
        gst_percentage: new FormControl(''),
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
        total: new FormControl(''),
        cgst_amount: new FormControl(''),
        sgst_amount: new FormControl(''),
        igst_amount: new FormControl(''),
        net_total: new FormControl(''),
      }),
    ]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (this.rawMaterialPurchaseForm.get('purchase_nested') as FormArray)
      .controls;
  }

  getBrandControl(index: number): FormControl {
    const control = (
      this.rawMaterialPurchaseForm.get('purchase_nested') as FormArray
    )
      .at(index)
      ?.get('brandid') as FormControl;
    return control;
  }

  isBrandControlInvalid(index: number): boolean {
    const control = this.getBrandControl(index);
    return control.touched && !!control.errors;
  }

  getItemControl(index: number): FormControl {
    const control = (
      this.rawMaterialPurchaseForm.get('purchase_nested') as FormArray
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
      this.rawMaterialPurchaseForm.get('purchase_nested') as FormArray
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
      this.rawMaterialPurchaseForm.get('purchase_nested') as FormArray
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
      this.rawMaterialPurchaseForm.get('purchase_nested') as FormArray
    )
      .at(index)
      ?.get('qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }

  addNesForm() {
    const newControl = new FormGroup({
      purchase_n_id: new FormControl(0),
      brandid: new FormControl(null),
      itemid: new FormControl(null),
      hsn_number: new FormControl(''),
      gst_percentage: new FormControl(''),
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
      total: new FormControl(''),
      cgst_amount: new FormControl(''),
      sgst_amount: new FormControl(''),
      igst_amount: new FormControl(''),
      net_total: new FormControl(''),
    });
    (this.rawMaterialPurchaseForm.get('purchase_nested') as FormArray).push(
      newControl
    );
    this.someMethod(); // Trigger change detection
  }

  changeInputTwoDigit(i: number): void {
    const control = this.rawMaterialPurchaseForm.get(
      'purchase_nested'
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

  removeNesForm(index: number) {
    (this.rawMaterialPurchaseForm.get('purchase_nested') as FormArray).removeAt(
      index
    );

    this.finalCalculation();
    this.someMethod(); // Trigger change detection
  }

  async getItemchange(i: any): Promise<void> {
    const Control = this.rawMaterialPurchaseForm.get(
      'purchase_nested'
    ) as FormArray;
    const brandid = Control.at(i).get('brandid')?.value;

    // Filter itemMasterList based on selected brandid
    const filteredItems = this.itemMasterList.filter(
      (e) => e.brandid === brandid
    );

    // Assign filtered list to newItemList for the corresponding index
    if (filteredItems && filteredItems.length > 0) {
      this.newItemList[brandid] = filteredItems;
    } else {
      this.newItemList[brandid] = []; // Set empty array if no matching items found
    }
    Control.at(i).get('itemid')?.setValue(null);
    this.colculation(i);
  }

  setHsn(i: any) {
    const Control = this.rawMaterialPurchaseForm.get(
      'purchase_nested'
    ) as FormArray;
    const proID = Control.at(i).get('itemid')?.value;
    Control.at(i)
      .get('hsn_number')
      ?.setValue(
        this.itemMasterList.filter((e) => {
          return e.itemid == proID;
        })[0].hsn_number
      );
    Control.at(i)
      .get('gst_percentage')
      ?.setValue(
        String(
          this.itemMasterList.filter((e) => {
            return e.itemid == proID;
          })[0].gst_percentage
        )
      );

    this.colculation(i);
  }

  colculation(i: any) {
    const Control = this.rawMaterialPurchaseForm.get(
      'purchase_nested'
    ) as FormArray;
    const price = Number(Control.at(i).get('price')?.value);
    const discount = Number(Control.at(i).get('discount')?.value);
    if (Number(discount) > 100) {
      Control.at(i).get('discount')?.setValue('');
    }
    const disAmount = price - (price * discount) / 100;
    const qty = Number(Control.at(i).get('qty')?.value);
    Control.at(i)
      .get('total')
      ?.setValue(String((disAmount * qty).toFixed(2)));

    const total = Number(Control.at(i).get('total')?.value);
    const gst = Number(Control.at(i).get('gst_percentage')?.value);
    const newArray = this.supplierDetailsList.filter((e) => {
      return e.supplierid == this.rawMaterialPurchaseForm.value.supplierid;
    });
    if (newArray.length > 0) {
      if (newArray[0].state_code == '33') {
        Control.at(i)
          .get('cgst_amount')
          ?.setValue(String((((total * gst) / 100) * 0.5).toFixed(2)));
        Control.at(i)
          .get('sgst_amount')
          ?.setValue(String((((total * gst) / 100) * 0.5).toFixed(2)));
        Control.at(i).get('igst_amount')?.setValue('0');
      } else {
        Control.at(i)
          .get('igst_amount')
          ?.setValue(String(((total * gst) / 100).toFixed(2)));
        Control.at(i).get('cgst_amount')?.setValue('0');
        Control.at(i).get('sgst_amount')?.setValue('0');
      }
    }

    const cgst = Number(Control.at(i).get('cgst_amount')?.value);
    const sgst = Number(Control.at(i).get('sgst_amount')?.value);
    const igst = Number(Control.at(i).get('igst_amount')?.value);

    Control.at(i)
      .get('net_total')
      ?.setValue(String((total + cgst + sgst + igst).toFixed(2)));

    this.finalCalculation();
  }

  finalCalculation() {
    const Control = this.rawMaterialPurchaseForm.get(
      'purchase_nested'
    ) as FormArray;
    const FormTotal = Control.value.reduce(
      (acc: any, val: any) => (acc += Number(val.net_total)),
      0
    );
    this.rawMaterialPurchaseForm
      .get('total')
      ?.setValue(String(FormTotal.toFixed(2)));
  }

  async save() {
    if (this.rawMaterialPurchaseForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.rawMaterialPurchaseForm.value;
        this.rMPSvc.addNew(value).subscribe((res) => {
          if (res.status == 'Saved successfully') {
            this.notificationSvc.success('Saved Success');
            this.cancelClick();
          } else if (res.status == 'Alredy') {
            this.notificationSvc.warn(
              'Bill No or Supplier Bill No already exists ! Please save it again'
            );
          } else {
            this.notificationSvc.error('Something error');
          }
        });
      }
    } else {
      this.rawMaterialPurchaseForm.markAllAsTouched();
    }
  }

  async update(item: any) {
    const nestedArray = await this.rMPSvc
      .getRawMAtrialNestedLists(item.purchaseid)
      .toPromise();

    const control = <FormArray>(
      this.rawMaterialPurchaseForm.controls['purchase_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.rawMaterialPurchaseForm.patchValue(item);
      this.rawMaterialPurchaseForm.get('cuid')?.setValue(this.userID);

      nestedArray?.forEach(async (e, i) => {
        const filteredItems = this.itemMasterList.filter(
          (ee) => ee.brandid == e.brandid
        );
        // Assign filtered list to newItemList for the corresponding index
        if (filteredItems && filteredItems.length > 0) {
          this.newItemList[e.brandid] = filteredItems;
        }

        const newControl = new FormGroup({
          purchase_n_id: new FormControl(e.purchase_n_id),
          brandid: new FormControl(e.brandid),
          itemid: new FormControl(e.itemid),
          hsn_number: new FormControl(e.hsn_number),
          gst_percentage: new FormControl(e.gst_percentage),
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
          total: new FormControl(e.total),
          cgst_amount: new FormControl(e.cgst_amount),
          sgst_amount: new FormControl(e.sgst_amount),
          igst_amount: new FormControl(e.igst_amount),
          net_total: new FormControl(e.net_total),
        });
        (this.rawMaterialPurchaseForm.get('purchase_nested') as FormArray).push(
          newControl
        );
        this.someMethod();
      });
    }

    this.scrollToTableTop();
  }

  cancelClick() {
    this.rawMaterialPurchaseForm.reset();
    const control = <FormArray>(
      this.rawMaterialPurchaseForm.controls['purchase_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.rawMaterialPurchaseForm.get('purchaseid')?.setValue(0);
    this.rawMaterialPurchaseForm.get('supplierid')?.setValue(null);
    this.rawMaterialPurchaseForm.get('date')?.setValue('');
    this.rawMaterialPurchaseForm.get('supplier_bill_no')?.setValue('');
    this.rawMaterialPurchaseForm.get('bill_no')?.setValue('');
    this.rawMaterialPurchaseForm.get('gst_in')?.setValue('');
    this.rawMaterialPurchaseForm.get('c_balance')?.setValue('');
    this.rawMaterialPurchaseForm.get('credit_days')?.setValue('');
    this.rawMaterialPurchaseForm.get('total')?.setValue('');
    this.rawMaterialPurchaseForm.get('cuid')?.setValue(this.userID);
    this.rawMaterialPurchaseForm.get('companyid')?.setValue(this.companyID);

    this.addNesForm();
    this.getSupplierList();
    this.findBillNo();
    this.getRawMAtrialList(this.today);
  }

  deleteFun(id: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.rMPSvc.delete(id).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
