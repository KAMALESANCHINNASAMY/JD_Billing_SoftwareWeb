import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { rawProductPurchaseService } from 'src/app/api-service/Accounts/rawProductPurchase.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { nestedProductMasterService } from 'src/app/api-service/nestedProductMaster.service';
import { SupplierMasterService } from 'src/app/api-service/supplierMaster.service';

@Component({
  selector: 'app-raw-product-purchase',
  templateUrl: './raw-product-purchase.component.html',
  styleUrl: './raw-product-purchase.component.scss'
})
export class RawProductPurchaseComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  supplierDetailsList: any[] = [];
  suggestions: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  rawProductList: any[] = [];
  NestedProductList: any[] = [];

  async ngOnInit() {
    this.getSupplierList();
    this.getNProductList();
    this.findBillNo();
    this.getRawMAtrialList(this.today);
  }

  constructor(
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private router: Router,
    private sMSvc: SupplierMasterService,
    private cdRef: ChangeDetectorRef,
    private rpPSvc: rawProductPurchaseService,
    private nPSvc: nestedProductMasterService
  ) { }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }
  getNProductList() {
    this.nPSvc.getList(this.companyID).subscribe((res) => {
      this.NestedProductList = res
    })
  }

  getRawMAtrialList(dated: any) {
    this.rpPSvc.getRawProductLists(this.companyID, dated).subscribe((res: any) => {
      this.rawProductList = res;
      this.cdRef.detectChanges();
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
      this.rawProductPurchaseForm.get('supplierid')?.setValue(id);
      this.rawProductPurchaseForm.get('gst_in')?.setValue(newArray[0].gst_in);

      const Control = this.rawProductPurchaseForm.get(
        'purchase_nested'
      ) as FormArray;
      Control.value.forEach((element: any, i: number) => {
        this.colculation(i);
      });
      this.someMethod(); // Trigger change detection
    }
  }

  async findBillNo(): Promise<void> {
    this.rpPSvc.getMaxId(this.companyID).subscribe((data) => {
      let maxnumber = 0;
      debugger
      if (data.length > 0) {
        maxnumber = data[0].purchaseid + 1;
        if (maxnumber < 10) {
          this.rawProductPurchaseForm.get('bill_no')?.setValue('0' + String(maxnumber));
        }
        else {
          this.rawProductPurchaseForm.get('bill_no')?.setValue(String(maxnumber));
        }
      }
    });
  }

  rawProductPurchaseForm = new FormGroup({
    purchaseid: new FormControl(0),
    supplierid: new FormControl(null),
    date: new FormControl(''),
    supplier_bill_no: new FormControl(''),
    bill_no: new FormControl(''),
    gst_in: new FormControl(''),
    credit_days: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    total: new FormControl(''),
    purchase_nested: new FormArray([
      new FormGroup({
        purchase_n_id: new FormControl(0),
        n_productid: new FormControl(null),
        hsn_number: new FormControl(''),
        gst_percentage: new FormControl(''),
        price: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        discount: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        qty: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
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
    return (this.rawProductPurchaseForm.get('purchase_nested') as FormArray).controls;
  }

  getProductControl(index: number): FormControl {
    const control = (
      this.rawProductPurchaseForm.get('purchase_nested') as FormArray
    )
      .at(index)?.get('n_productid') as FormControl;
    return control;
  }

  isProductControlInvalid(index: number): boolean {
    const control = this.getProductControl(index);
    return control.touched && !!control.errors;
  }

  getPriceControl(index: number): FormControl {
    const control = (
      this.rawProductPurchaseForm.get('purchase_nested') as FormArray
    )
      .at(index)?.get('price') as FormControl;
    return control;
  }

  isPriceControlInvalid(index: number): boolean {
    const control = this.getPriceControl(index);
    return control.touched && !!control.errors;
  }

  getDiscountControl(index: number): FormControl {
    const control = (
      this.rawProductPurchaseForm.get('purchase_nested') as FormArray
    )
      .at(index)?.get('discount') as FormControl;
    return control;
  }

  isDiscountControlInvalid(index: number): boolean {
    const control = this.getDiscountControl(index);
    return control.touched && !!control.errors;
  }

  getQtyControl(index: number): FormControl {
    const control = (
      this.rawProductPurchaseForm.get('purchase_nested') as FormArray
    )
      .at(index)?.get('qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }

  addNesForm() {
    const newControl = new FormGroup({
      purchase_n_id: new FormControl(0),
      n_productid: new FormControl(null),
      hsn_number: new FormControl(''),
      gst_percentage: new FormControl(''),
      price: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      discount: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      qty: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
      total: new FormControl(''),
      cgst_amount: new FormControl(''),
      sgst_amount: new FormControl(''),
      igst_amount: new FormControl(''),
      net_total: new FormControl(''),
    });
    (this.rawProductPurchaseForm.get('purchase_nested') as FormArray).push(
      newControl
    );
    this.someMethod(); // Trigger change detection
  }

  removeNesForm(index: number) {
    (this.rawProductPurchaseForm.get('purchase_nested') as FormArray).removeAt(
      index
    );

    this.finalCalculation();
    this.someMethod(); // Trigger change detection
  }


  setHsn(i: any) {
    debugger
    const Control = this.rawProductPurchaseForm.get('purchase_nested') as FormArray;
    const proID = Control.at(i).get('n_productid')?.value;
    const newGSTDet = this.NestedProductList.find((e) => { return e.n_productid == proID });
    Control.at(i).get('hsn_number')?.setValue(newGSTDet.hsn_number);
    Control.at(i).get('gst_percentage')?.setValue(newGSTDet.gst_percentage);

    this.colculation(i);
  }

  colculation(i: any) {
    debugger
    const Control = this.rawProductPurchaseForm.get('purchase_nested') as FormArray;
    const price = Number(Control.at(i).get('price')?.value);
    const discount = Number(Control.at(i).get('discount')?.value);
    if (Number(discount) > 100) {
      Control.at(i).get('discount')?.setValue('');
    }
    const disAmount = price - (price * discount) / 100;
    const qty = Number(Control.at(i).get('qty')?.value);
    Control.at(i).get('total')?.setValue(String((disAmount * qty).toFixed(2)));

    const total = Number(Control.at(i).get('total')?.value);
    const gst = Number(Control.at(i).get('gst_percentage')?.value);
    debugger
    const stateCode = this.supplierDetailsList.find((e) => { return e.supplierid == this.rawProductPurchaseForm.value.supplierid });
    if (stateCode) {
      if (stateCode.state_code == '33') {
        Control.at(i).get('cgst_amount')?.setValue(String((((total * gst) / 100) * 0.5).toFixed(2)));
        Control.at(i).get('sgst_amount')?.setValue(String((((total * gst) / 100) * 0.5).toFixed(2)));
        Control.at(i).get('igst_amount')?.setValue('0');
      } else {
        Control.at(i).get('igst_amount')?.setValue(String(((total * gst) / 100).toFixed(2)));
        Control.at(i).get('cgst_amount')?.setValue('0');
        Control.at(i).get('sgst_amount')?.setValue('0');
      }
    }

    const cgst = Number(Control.at(i).get('cgst_amount')?.value);
    const sgst = Number(Control.at(i).get('sgst_amount')?.value);
    const igst = Number(Control.at(i).get('igst_amount')?.value);

    Control.at(i).get('net_total')?.setValue(String((total + cgst + sgst + igst).toFixed(2)));

    this.finalCalculation();
  }

  finalCalculation() {
    const Control = this.rawProductPurchaseForm.get('purchase_nested') as FormArray;
    const FormTotal = Control.value.reduce((acc: any, val: any) => (acc += Number(val.net_total)), 0);
    this.rawProductPurchaseForm.get('total')?.setValue(String(FormTotal.toFixed(2)));
  }

  async save() {
    if (this.rawProductPurchaseForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed().toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.rawProductPurchaseForm.value;
        this.rpPSvc.addNew(value).subscribe((res) => {
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
      this.rawProductPurchaseForm.markAllAsTouched();
    }
  }

  async update(item: any) {
    const nestedArray = await this.rpPSvc.getRawProductNestedLists(item.purchaseid).toPromise();

    const control = <FormArray>(this.rawProductPurchaseForm.controls['purchase_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.rawProductPurchaseForm.patchValue(item);
      this.rawProductPurchaseForm.get('cuid')?.setValue(this.userID);

      nestedArray?.forEach(async (e, i) => {
        const newControl = new FormGroup({
          purchase_n_id: new FormControl(e.purchase_n_id),
          n_productid: new FormControl(e.n_productid),
          hsn_number: new FormControl(e.hsn_number),
          gst_percentage: new FormControl(e.gst_percentage),
          price: new FormControl(e.price, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
          discount: new FormControl(e.discount, [
            Validators.required,
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
          ]),
          qty: new FormControl(e.qty, [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
          total: new FormControl(e.total),
          cgst_amount: new FormControl(e.cgst_amount),
          sgst_amount: new FormControl(e.sgst_amount),
          igst_amount: new FormControl(e.igst_amount),
          net_total: new FormControl(e.net_total),
        });
        (this.rawProductPurchaseForm.get('purchase_nested') as FormArray).push(newControl);
        this.someMethod();
      });
    }

    this.scrollToTableTop();
  }

  cancelClick() {
    this.rawProductPurchaseForm.reset();
    const control = <FormArray>(
      this.rawProductPurchaseForm.controls['purchase_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.rawProductPurchaseForm.get('purchaseid')?.setValue(0);
    this.rawProductPurchaseForm.get('supplierid')?.setValue(null);
    this.rawProductPurchaseForm.get('date')?.setValue('');
    this.rawProductPurchaseForm.get('supplier_bill_no')?.setValue('');
    this.rawProductPurchaseForm.get('bill_no')?.setValue('');
    this.rawProductPurchaseForm.get('gst_in')?.setValue('');
    this.rawProductPurchaseForm.get('credit_days')?.setValue('');
    this.rawProductPurchaseForm.get('total')?.setValue('');
    this.rawProductPurchaseForm.get('cuid')?.setValue(this.userID);
    this.rawProductPurchaseForm.get('companyid')?.setValue(this.companyID);

    this.addNesForm();
    this.getSupplierList();
    this.findBillNo();
    this.getRawMAtrialList(this.today);
  }

  deleteFun(id: number) {
    debugger
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.rpPSvc.delete(id).subscribe((res) => {
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
