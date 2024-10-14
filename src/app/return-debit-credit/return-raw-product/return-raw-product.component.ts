import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { rawProductPurchaseService } from 'src/app/api-service/Accounts/rawProductPurchase.service';
import { rawProductReturnService } from 'src/app/api-service/Credit-Debit-note/rawProductReturn.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { nestedProductMasterService } from 'src/app/api-service/nestedProductMaster.service';
import { SupplierMasterService } from 'src/app/api-service/supplierMaster.service';

@Component({
  selector: 'app-return-raw-product',
  templateUrl: './return-raw-product.component.html',
  styleUrl: './return-raw-product.component.scss'
})
export class ReturnRawProductComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  supplierDetailsList: any[] = [];
  suggestions: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  RawProductList: any[] = [];
  supplierDebitList: any[] = [];
  NestedProductList: any[] = [];

  constructor(
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private router: Router,
    private sMSvc: SupplierMasterService,
    private cdRef: ChangeDetectorRef,
    private rrPSvc: rawProductReturnService,
    private rpPSvc: rawProductPurchaseService,
    private nPSvc: nestedProductMasterService
  ) { }
  ngOnInit() {
    this.getSupplierList();
    this.getSupplierDebitList(this.today);
    this.findBillNo();
    this.getNProductList();
  }

  getSupplierList() {
    this.sMSvc.getList(this.companyID).subscribe((res: any) => {
      this.supplierDetailsList = res;
      this.suggestions = res;
    });
  }

  getNProductList() {
    this.nPSvc.getList(this.companyID).subscribe((res) => {
      this.NestedProductList = res
    })
  }

  getSupplierDebitList(dated: any) {
    this.rrPSvc.get(this.companyID, dated).subscribe((res: any) => {
      this.supplierDebitList = res;
      this.cdRef.detectChanges();
    });
  }

  async setSupplierDetails(id: any) {
    this.SupplierDebitForm.get('purchaseid')?.setValue(null);
    this.RawProductList = []
    this.rrPSvc.getRawProductBySupplier(this.companyID, id).subscribe((res) => {
      this.RawProductList = res;
    });
    this.someMethod();
  }

  suggest(value: any) {
    this.suggestions = this.supplierDetailsList.filter((item) =>
      item.supplier_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.supplierDetailsList;
  }

  async findBillNo(): Promise<void> {
    const data: any = await this.rrPSvc.getMaxId(this.companyID).toPromise();
    let maxnumber = 0;
    if (Number(data.length) > 0 && this.SupplierDebitForm.value.returnid == 0) {
      maxnumber = data[0].returnid + 1;
      if (maxnumber < 10) {
        this.SupplierDebitForm.get('return_no')?.setValue('0' + String(maxnumber));
      } else {
        this.SupplierDebitForm.get('return_no')?.setValue(String(maxnumber));
      }
    }
  }

  async onBillNoSelected(value: any) {
    const nestedArray = await this.rpPSvc.getRawProductNestedLists(value.purchaseid).toPromise();
    const control = <FormArray><unknown>(this.SupplierDebitForm.controls['rawProduct_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0 && nestedArray?.length != 0) {
      this.SupplierDebitForm.get('total')?.setValue(value.total);
      this.SupplierDebitForm.get('bill_no')?.setValue(value.bill_no);
      nestedArray?.forEach(async (e, i) => {
        const newControl = new FormGroup({
          return_n_id: new FormControl(0),
          purchase_n_id: new FormControl(e.purchase_n_id),
          n_productid: new FormControl(e.n_productid),
          gst_percentage: new FormControl(e.gst_percentage),
          a_qty: new FormControl(e.a_qty),
          ret_a_qty: new FormControl(e.ret_a_qty),
          price: new FormControl(e.price),
          discount: new FormControl(e.discount),
          qty: new FormControl(e.qty),
          ret_qty: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
          total: new FormControl(e.total),
          ret_total: new FormControl(''),
          re_amount: new FormControl(e.re_amount),
          ret_re_amount: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
          cgst_amount: new FormControl(e.cgst_amount),
          ret_cgst_amount: new FormControl(''),
          sgst_amount: new FormControl(e.sgst_amount),
          ret_sgst_amount: new FormControl(''),
          igst_amount: new FormControl(e.igst_amount),
          ret_igst_amount: new FormControl(''),
          net_total: new FormControl(e.net_total),
          ret_net_total: new FormControl('')
        });
        (this.SupplierDebitForm.get('rawProduct_nested') as FormArray).push(
          newControl
        );
        this.someMethod();
      });
    }
  }

  someMethod() {
    this.cdRef.detectChanges();
  }
  SupplierDebitForm = new FormGroup({
    returnid: new FormControl(0),
    purchaseid: new FormControl(null),
    supplierid: new FormControl(null),
    bill_no: new FormControl('', [Validators.required]),
    return_no: new FormControl(''),
    return_date: new FormControl(''),
    total: new FormControl(''),
    return_total: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    rawProduct_nested: new FormArray([]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (this.SupplierDebitForm.get('rawProduct_nested') as FormArray).controls;
  }

  getQtyControl(index: number): FormControl {
    const control = (this.SupplierDebitForm.get('rawProduct_nested') as FormArray).at(index)?.get('ret_qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }

  getaQtyControl(index: number): FormControl {
    const control = (this.SupplierDebitForm.get('rawProduct_nested') as FormArray).at(index)?.get('ret_a_qty') as FormControl;
    return control;
  }

  isAQtyControlInvalid(index: number): boolean {
    const control = this.getaQtyControl(index);
    return control.touched && !!control.errors;
  }

  async save() {
    if (this.SupplierDebitForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.SupplierDebitForm.value;
        this.rrPSvc.addNew(value).subscribe((res) => {
          if (res.status == 'Saved successfully') {
            this.notificationSvc.success('Saved Success');
            this.cancelClick();
          }
          else if ('Alredy') {
            this.notificationSvc.warn('Bill No or Invoice No already exists!');
          }
          else {
            this.notificationSvc.error('Something error');
          }
        });
      }
    } else {
      this.SupplierDebitForm.markAllAsTouched();
    }
  }

  async update(item: any) {
    await this.cancelClick();
    await this.setSupplierDetails(item.supplierid)
    const nestedArray = await this.rrPSvc.getReturnNested(item.returnid).toPromise();

    const control = <FormArray><unknown>(this.SupplierDebitForm.controls['rawProduct_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }

    if (control.length == 0) {
      this.SupplierDebitForm.patchValue(item);
      nestedArray?.forEach(async (e, i) => {
        const newControl = new FormGroup({
          return_n_id: new FormControl(0),
          purchase_n_id: new FormControl(e.purchase_n_id),
          n_productid: new FormControl(e.n_productid),
          gst_percentage: new FormControl(e.gst_percentage),
          a_qty: new FormControl(e.a_qty),
          ret_a_qty: new FormControl(e.ret_a_qty),
          price: new FormControl(e.price),
          discount: new FormControl(e.discount),
          qty: new FormControl(e.qty),
          ret_qty: new FormControl(e.ret_qty, [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
          total: new FormControl(e.total),
          ret_total: new FormControl(e.ret_total),
          re_amount: new FormControl(e.re_amount),
          ret_re_amount: new FormControl(e.ret_re_amount, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
          cgst_amount: new FormControl(e.cgst_amount),
          ret_cgst_amount: new FormControl(e.ret_cgst_amount),
          sgst_amount: new FormControl(e.sgst_amount),
          ret_sgst_amount: new FormControl(e.ret_sgst_amount),
          igst_amount: new FormControl(e.igst_amount),
          ret_igst_amount: new FormControl(e.ret_igst_amount),
          net_total: new FormControl(e.net_total),
          ret_net_total: new FormControl(e.ret_net_total)
        });
        (this.SupplierDebitForm.get('rawProduct_nested') as FormArray).push(
          newControl
        );
        this.someMethod();
      });
    }
  }

  colculation(i: any) {
    const Control = this.SupplierDebitForm.get('rawProduct_nested') as FormArray;
    const price = Number(Control.at(i).get('price')?.value);
    const discount = Number(Control.at(i).get('discount')?.value);
    if (Number(discount) > 100) {
      Control.at(i).get('discount')?.setValue('');
    }
    if (
      Number(Control.at(i).get('ret_qty')?.value) >
      Number(Control.at(i).get('qty')?.value)
    ) {
      Control.at(i).get('ret_qty')?.setValue(Control.at(i).get('qty')?.value);
      this.notificationSvc.error('Invalid QTY!');
    }

    if (
      Number(Control.at(i).get('ret_a_qty')?.value) >
      Number(Control.at(i).get('a_qty')?.value)
    ) {
      Control.at(i).get('ret_a_qty')?.setValue(Control.at(i).get('a_qty')?.value);
      this.notificationSvc.error('Invalid Actual QTY!');
    }

    const disAmount = price - (price * discount) / 100;
    const qty = Number(Control.at(i).get('ret_qty')?.value);
    Control.at(i).get('ret_total')?.setValue(String((disAmount * qty).toFixed(2)));

    const sutotal = (Number(Control.at(i).get('ret_total')?.value)) + (Number(Control.at(i).get('ret_re_amount')?.value));
    const gst = Number(Control.at(i).get('gst_percentage')?.value);
    const newArray = this.supplierDetailsList.filter((e) => {
      return e.supplierid == this.SupplierDebitForm.value.supplierid;
    });
    if (newArray.length > 0) {
      if (newArray[0].state_code == '33') {
        Control.at(i).get('ret_cgst_amount')?.setValue(String((((sutotal * gst) / 100) * 0.5).toFixed(2)));
        Control.at(i).get('ret_sgst_amount')?.setValue(String((((sutotal * gst) / 100) * 0.5).toFixed(2)));
        Control.at(i).get('ret_igst_amount')?.setValue('0');
      } else {
        Control.at(i).get('ret_igst_amount')?.setValue(String(((sutotal * gst) / 100).toFixed(2)));
        Control.at(i).get('ret_cgst_amount')?.setValue('0');
        Control.at(i).get('ret_sgst_amount')?.setValue('0');
      }
    }

    const cgst = Number(Control.at(i).get('ret_cgst_amount')?.value);
    const sgst = Number(Control.at(i).get('ret_sgst_amount')?.value);
    const igst = Number(Control.at(i).get('ret_igst_amount')?.value);

    Control.at(i).get('ret_net_total')?.setValue(String((sutotal + cgst + sgst + igst).toFixed(2)));

    this.finalCalculation();
  }

  async finalCalculation() {
    const Control = this.SupplierDebitForm.get('rawProduct_nested') as FormArray;

    const FormTotal = Control.value.reduce((acc: number, val: any) => (acc += Number(val.net_total)), 0);
    this.SupplierDebitForm.get('total')?.setValue(String(FormTotal.toFixed(2)));

    const FormReturnTotal = Control.value.reduce((acc: number, val: any) => (acc += Number(val.ret_net_total)), 0);
    this.SupplierDebitForm.get('return_total')?.setValue(String(FormReturnTotal.toFixed(2)));
  }

  async cancelClick() {
    this.SupplierDebitForm.reset();
    const control = <FormArray><unknown>(
      this.SupplierDebitForm.controls['rawProduct_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.SupplierDebitForm.get('returnid')?.setValue(0);
    this.SupplierDebitForm.get('supplierid')?.setValue(null);
    this.SupplierDebitForm.get('return_date')?.setValue('');
    this.SupplierDebitForm.get('total')?.setValue('');
    this.SupplierDebitForm.get('return_total')?.setValue('');
    this.SupplierDebitForm.get('cuid')?.setValue(this.userID);
    this.SupplierDebitForm.get('companyid')?.setValue(this.companyID);
    this.findBillNo();
    this.getSupplierList();
    this.getSupplierDebitList(this.today);
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }
}
