import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { saleProductsService } from 'src/app/api-service/Accounts/saleProducts.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { productMasterService } from 'src/app/api-service/productMaster.service';
import { salesBillPrintService } from 'src/app/api-service/reports/saleBillPrint.service';

@Component({
  selector: 'app-sales-product',
  templateUrl: './sales-product.component.html',
  styleUrl: './sales-product.component.scss'
})
export class SalesProductComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  customerDetailsList: any[] = [];
  productList: any[] = [];
  saleProductsList: any[] = [];

  async ngOnInit() {
    this.getCustomerList();
    this.getProductList();
    this.findBillNo();
    this.getSalesProductList(this.today);
  }

  constructor(
    private DialogSvc: DialogService,
    private cMSvc: customerMasterService,
    private notificationSvc: NotificationsService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private rpPSvc: saleProductsService,
    private pSvc: productMasterService,
    private sBPSvc: salesBillPrintService
  ) { }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getProductList() {
    this.pSvc.getList(this.companyID).subscribe((res) => {
      this.productList = res
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
  getSalesProductList(dated: any) {
    this.rpPSvc.getSalesLists(this.companyID, dated).subscribe((res: any) => {
      this.saleProductsList = res;
      this.cdRef.detectChanges();
    });
  }

  someMethod() {
    this.cdRef.detectChanges();
  }

  setCustomerDetails(id: any) {
    const newArray = this.customerDetailsList.filter((e) => {
      return e.customerid == id;
    });
    if (newArray.length > 0) {
      this.saleProductsForm.get('customerid')?.setValue(id);
      this.saleProductsForm.get('gst_in')?.setValue(newArray[0].gst_in);

      const Control = this.saleProductsForm.get(
        'sale_nested'
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
        maxnumber = data[0].entryid + 1;
        if (maxnumber < 10) {
          this.saleProductsForm.get('bill_no')?.setValue('0' + String(maxnumber));
        }
        else {
          this.saleProductsForm.get('bill_no')?.setValue(String(maxnumber));
        }
      }
    });
  }

  saleProductsForm = new FormGroup({
    entryid: new FormControl(0),
    customerid: new FormControl(null),
    date: new FormControl(''),
    bill_no: new FormControl(''),
    gst_in: new FormControl(''),
    credit_days: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    total: new FormControl(''),
    sale_nested: new FormArray([
      new FormGroup({
        entry_n_id: new FormControl(0),
        productid: new FormControl(null),
        gst_percentage: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        price: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        discount: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        qty: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
        total: new FormControl(''),
        re_amount: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        cgst_amount: new FormControl(''),
        sgst_amount: new FormControl(''),
        igst_amount: new FormControl(''),
        net_total: new FormControl(''),
        av_qty: new FormControl('')
      }),
    ]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (this.saleProductsForm.get('sale_nested') as FormArray).controls;
  }

  getProductControl(index: number): FormControl {
    const control = (
      this.saleProductsForm.get('sale_nested') as FormArray
    )
      .at(index)?.get('productid') as FormControl;
    return control;
  }

  isProductControlInvalid(index: number): boolean {
    const control = this.getProductControl(index);
    return control.touched && !!control.errors;
  }

  getPriceControl(index: number): FormControl {
    const control = (
      this.saleProductsForm.get('sale_nested') as FormArray
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
      this.saleProductsForm.get('sale_nested') as FormArray
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
      this.saleProductsForm.get('sale_nested') as FormArray
    )
      .at(index)?.get('qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }

  getgstControl(index: number): FormControl {
    const control = (
      this.saleProductsForm.get('sale_nested') as FormArray
    )
      .at(index)?.get('gst_percentage') as FormControl;
    return control;
  }

  isgstControlInvalid(index: number): boolean {
    const control = this.getgstControl(index);
    return control.touched && !!control.errors;
  }

  addNesForm() {
    const newControl = new FormGroup({
      entry_n_id: new FormControl(0),
      productid: new FormControl(null),
      gst_percentage: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      price: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      discount: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      qty: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
      total: new FormControl(''),
      re_amount: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      cgst_amount: new FormControl(''),
      sgst_amount: new FormControl(''),
      igst_amount: new FormControl(''),
      net_total: new FormControl(''),
      av_qty: new FormControl('')
    });
    (this.saleProductsForm.get('sale_nested') as FormArray).push(
      newControl
    );
    this.someMethod(); // Trigger change detection
  }

  removeNesForm(index: number) {
    (this.saleProductsForm.get('sale_nested') as FormArray).removeAt(
      index
    );

    this.finalCalculation();
    this.someMethod(); // Trigger change detection
  }

  setHsn(i: any) {
    debugger
    const Control = this.saleProductsForm.get('sale_nested') as FormArray;
    const proID = Control.at(i).get('productid')?.value;
    const newGSTDet = this.productList.find((e) => { return e.productid == proID });
    Control.at(i).get('price')?.setValue(newGSTDet.price);
    Control.at(i).get('gst_percentage')?.setValue(newGSTDet.gst_percentage);
    Control.at(i).get('av_qty')?.setValue(newGSTDet.av_qty);

    this.colculation(i);
  }

  colculation(i: any) {
    debugger
    const Control = this.saleProductsForm.get('sale_nested') as FormArray;
    const price = Number(Control.at(i).get('price')?.value);
    const discount = Number(Control.at(i).get('discount')?.value);
    if (Number(discount) > 100) {
      Control.at(i).get('discount')?.setValue('');
    }
    if (Number(Control.at(i).get('qty')?.value) > Number(Control.at(i).get('av_qty')?.value)) {
      Control.at(i).get('qty')?.setValue('');
      this.notificationSvc.error('Invaild Qty')
    }
    const disAmount = price - (price * discount) / 100;
    const qty = Number(Control.at(i).get('qty')?.value);
    Control.at(i).get('total')?.setValue(String((disAmount * qty).toFixed(2)));

    const sutotal = (Number(Control.at(i).get('total')?.value)) + (Number(Control.at(i).get('re_amount')?.value));
    const gst = Number(Control.at(i).get('gst_percentage')?.value);
    debugger
    const stateCode = this.customerDetailsList.find((e) => { return e.customerid == this.saleProductsForm.value.customerid });
    if (stateCode) {
      if (stateCode.state_code == '33') {
        Control.at(i).get('cgst_amount')?.setValue(String((((sutotal * gst) / 100) * 0.5).toFixed(2)));
        Control.at(i).get('sgst_amount')?.setValue(String((((sutotal * gst) / 100) * 0.5).toFixed(2)));
        Control.at(i).get('igst_amount')?.setValue('0');
      } else {
        Control.at(i).get('igst_amount')?.setValue(String(((sutotal * gst) / 100).toFixed(2)));
        Control.at(i).get('cgst_amount')?.setValue('0');
        Control.at(i).get('sgst_amount')?.setValue('0');
      }
    }

    const cgst = Number(Control.at(i).get('cgst_amount')?.value);
    const sgst = Number(Control.at(i).get('sgst_amount')?.value);
    const igst = Number(Control.at(i).get('igst_amount')?.value);

    Control.at(i).get('net_total')?.setValue(String((sutotal + cgst + sgst + igst).toFixed(2)));

    this.finalCalculation();
  }

  finalCalculation() {
    const Control = this.saleProductsForm.get('sale_nested') as FormArray;
    const FormTotal = Control.value.reduce((acc: any, val: any) => (acc += Number(val.net_total)), 0);
    this.saleProductsForm.get('total')?.setValue(String(FormTotal.toFixed(2)));
  }

  async save() {
    if (this.saleProductsForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed().toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.saleProductsForm.value;
        this.rpPSvc.addNew(value).subscribe((res) => {
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
      this.saleProductsForm.markAllAsTouched();
    }
  }

  async update(item: any) {
    const nestedArray = await this.rpPSvc.getSalesNestedLists(item.entryid).toPromise();

    const control = <FormArray>(this.saleProductsForm.controls['sale_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.saleProductsForm.patchValue(item);
      this.saleProductsForm.get('cuid')?.setValue(this.userID);

      nestedArray?.forEach(async (e, i) => {
        const newGSTDet = this.productList.find((ee) => { return ee.productid == e.productid });
        const newControl = new FormGroup({
          entry_n_id: new FormControl(e.entry_n_id),
          productid: new FormControl(e.productid),
          gst_percentage: new FormControl(e.gst_percentage, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
          price: new FormControl(e.price, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
          discount: new FormControl(e.discount, [
            Validators.required,
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
          ]),
          qty: new FormControl(e.qty, [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
          total: new FormControl(e.total),
          re_amount: new FormControl(e.re_amount, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
          cgst_amount: new FormControl(e.cgst_amount),
          sgst_amount: new FormControl(e.sgst_amount),
          igst_amount: new FormControl(e.igst_amount),
          net_total: new FormControl(e.net_total),
          av_qty: new FormControl(newGSTDet.av_qty)
        });
        (this.saleProductsForm.get('sale_nested') as FormArray).push(newControl);
        this.someMethod();
      });
    }

    this.scrollToTableTop();
  }

  async getReport(item: any) {
    const nested = await this.rpPSvc.getSalesNestedLists(item.entryid).toPromise();
    this.sBPSvc.openConfirmDialog(item, nested)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
        }
      });
  }


  cancelClick() {
    this.saleProductsForm.reset();
    const control = <FormArray>(
      this.saleProductsForm.controls['sale_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.saleProductsForm.get('entryid')?.setValue(0);
    this.saleProductsForm.get('customerid')?.setValue(null);
    this.saleProductsForm.get('date')?.setValue('');
    this.saleProductsForm.get('bill_no')?.setValue('');
    this.saleProductsForm.get('gst_in')?.setValue('');
    this.saleProductsForm.get('credit_days')?.setValue('');
    this.saleProductsForm.get('total')?.setValue('');
    this.saleProductsForm.get('cuid')?.setValue(this.userID);
    this.saleProductsForm.get('companyid')?.setValue(this.companyID);

    this.addNesForm();
    this.findBillNo();
    this.getProductList();
    this.getSalesProductList(this.today);
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
