import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { saleProductsService } from 'src/app/api-service/Accounts/saleProducts.service';
import { salesProductReturnService } from 'src/app/api-service/Credit-Debit-note/salesProductReturn.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { productMasterService } from 'src/app/api-service/productMaster.service';

@Component({
  selector: 'app-return-sales-product',
  templateUrl: './return-sales-product.component.html',
  styleUrl: './return-sales-product.component.scss'
})
export class ReturnSalesProductComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  salesProductList: any[] = [];
  customerDetailsList: any[] = [];
  productList: any[] = [];
  salesDebitList: any[] = [];

  constructor(
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private router: Router,
    private cMSvc: customerMasterService,
    private cdRef: ChangeDetectorRef,
    private pSvc: productMasterService,
    private srPSvc: salesProductReturnService,
    private rpPSvc: saleProductsService
  ) { }
  ngOnInit() {
    this.getCustomerList();
    this.getSalesDebitList(this.today);
    this.findBillNo();
    this.getProductList();
  }

  getCustomerList() {
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.customerDetailsList = res;
      this.suggestions = res;
    });
  }

  getSalesDebitList(dated: any) {
    this.srPSvc.get(this.companyID, dated).subscribe((res: any) => {
      this.salesDebitList = res;
      this.cdRef.detectChanges();
    });
  }

  getProductList() {
    this.pSvc.getList(this.companyID).subscribe((res) => {
      this.productList = res
    })
  }

  async setCustomerDetails(id: any) {
    this.salesDebitForm.get('entryid')?.setValue(null);
    this.salesProductList = []
    this.srPSvc.getSalesProductByCustomer(this.companyID, id).subscribe((res) => {
      this.salesProductList = res;
    });
    this.someMethod();
  }

  suggest(value: any) {
    this.suggestions = this.customerDetailsList.filter((item) =>
      item.customer_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.customerDetailsList;
  }

  async findBillNo(): Promise<void> {
    const data: any = await this.srPSvc.getMaxId(this.companyID).toPromise();
    let maxnumber = 0;
    if (Number(data.length) > 0 && this.salesDebitForm.value.returnid == 0) {
      maxnumber = data[0].returnid + 1;
      if (maxnumber < 10) {
        this.salesDebitForm.get('return_no')?.setValue('0' + String(maxnumber));
      } else {
        this.salesDebitForm.get('return_no')?.setValue(String(maxnumber));
      }
    }
  }

  async onBillNoSelected(value: any) {
    debugger
    const nestedArray = await this.rpPSvc.getSalesNestedLists(value.entryid).toPromise();
    const control = <FormArray><unknown>(this.salesDebitForm.controls['salesProduct_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0 && nestedArray?.length != 0) {
      debugger
      this.salesDebitForm.get('total')?.setValue(value.total);
      this.salesDebitForm.get('bill_no')?.setValue(value.bill_no);
      nestedArray?.forEach(async (e, i) => {
        const newControl = new FormGroup({
          return_n_id: new FormControl(0),
          entry_n_id: new FormControl(e.entry_n_id),
          productid: new FormControl(e.productid),
          gst_percentage: new FormControl(e.gst_percentage),
          price: new FormControl(e.price),
          discount: new FormControl(e.discount),
          qty: new FormControl(e.qty),
          ret_qty: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
          total: new FormControl(e.total),
          ret_total: new FormControl(''),
          re_amount: new FormControl(e.re_amount),
          ret_re_amount: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
          cgst_amount: new FormControl(e.cgst_amount),
          ret_cgst_amount: new FormControl(''),
          sgst_amount: new FormControl(e.sgst_amount),
          ret_sgst_amount: new FormControl(''),
          igst_amount: new FormControl(e.igst_amount),
          ret_igst_amount: new FormControl(''),
          net_total: new FormControl(e.net_total),
          ret_net_total: new FormControl('')
        });
        (this.salesDebitForm.get('salesProduct_nested') as FormArray).push(
          newControl
        );
        this.someMethod();
      });
    }
  }

  someMethod() {
    this.cdRef.detectChanges();
  }
  salesDebitForm = new FormGroup({
    returnid: new FormControl(0),
    entryid: new FormControl(null),
    customerid: new FormControl(null),
    bill_no: new FormControl('', [Validators.required]),
    return_no: new FormControl(''),
    return_date: new FormControl(''),
    total: new FormControl(''),
    return_total: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    salesProduct_nested: new FormArray([]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (this.salesDebitForm.get('salesProduct_nested') as FormArray).controls;
  }

  getQtyControl(index: number): FormControl {
    const control = (this.salesDebitForm.get('salesProduct_nested') as FormArray).at(index)?.get('ret_qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }

  getRemControl(index: number): FormControl {
    const control = (this.salesDebitForm.get('salesProduct_nested') as FormArray).at(index)?.get('ret_re_amount') as FormControl;
    return control;
  }

  isRemControlInvalid(index: number): boolean {
    const control = this.getRemControl(index);
    return control.touched && !!control.errors;
  }

  async save() {
    if (this.salesDebitForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.salesDebitForm.value;
        this.srPSvc.addNew(value).subscribe((res) => {
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
      this.salesDebitForm.markAllAsTouched();
    }
  }

  async update(item: any) {
    await this.cancelClick();
    await this.setCustomerDetails(item.customerid)
    const nestedArray = await this.srPSvc.getReturnNested(item.returnid).toPromise();

    const control = <FormArray><unknown>(this.salesDebitForm.controls['salesProduct_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }

    if (control.length == 0) {
      this.salesDebitForm.patchValue(item);
      nestedArray?.forEach(async (e, i) => {
        const newControl = new FormGroup({
          return_n_id: new FormControl(0),
          entry_n_id: new FormControl(e.entry_n_id),
          productid: new FormControl(e.productid),
          gst_percentage: new FormControl(e.gst_percentage),
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
        (this.salesDebitForm.get('salesProduct_nested') as FormArray).push(
          newControl
        );
        this.someMethod();
      });
    }
  }

  colculation(i: any) {
    const Control = this.salesDebitForm.get('salesProduct_nested') as FormArray;
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

    const disAmount = price - (price * discount) / 100;
    const qty = Number(Control.at(i).get('ret_qty')?.value);
    Control.at(i).get('ret_total')?.setValue(String((disAmount * qty).toFixed(2)));

    const sutotal = (Number(Control.at(i).get('ret_total')?.value)) + (Number(Control.at(i).get('ret_re_amount')?.value));
    debugger
    const gst = Number(Control.at(i).get('gst_percentage')?.value);
    const newArray = this.customerDetailsList.filter((e) => {
      return e.customerid == this.salesDebitForm.value.customerid;
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
    const Control = this.salesDebitForm.get('salesProduct_nested') as FormArray;

    const FormTotal = Control.value.reduce((acc: number, val: any) => (acc += Number(val.net_total)), 0);
    this.salesDebitForm.get('total')?.setValue(String(FormTotal.toFixed(2)));

    const FormReturnTotal = Control.value.reduce((acc: number, val: any) => (acc += Number(val.ret_net_total)), 0);
    this.salesDebitForm.get('return_total')?.setValue(String(FormReturnTotal.toFixed(2)));
  }

  async cancelClick() {
    this.salesDebitForm.reset();
    const control = <FormArray><unknown>(
      this.salesDebitForm.controls['salesProduct_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.salesDebitForm.get('returnid')?.setValue(0);
    this.salesDebitForm.get('customerid')?.setValue(null);
    this.salesDebitForm.get('return_date')?.setValue('');
    this.salesDebitForm.get('total')?.setValue('');
    this.salesDebitForm.get('return_total')?.setValue('');
    this.salesDebitForm.get('cuid')?.setValue(this.userID);
    this.salesDebitForm.get('companyid')?.setValue(this.companyID);
    this.findBillNo();
    this.getSalesDebitList(this.today);
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }
}
