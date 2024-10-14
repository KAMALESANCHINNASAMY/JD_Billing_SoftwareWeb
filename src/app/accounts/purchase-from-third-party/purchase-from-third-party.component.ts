import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { purchaseFromThirdPartyService } from 'src/app/api-service/Accounts/purchaseFromThirdParty.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { productMasterService } from 'src/app/api-service/productMaster.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';

@Component({
  selector: 'app-purchase-from-third-party',
  templateUrl: './purchase-from-third-party.component.html',
  styleUrl: './purchase-from-third-party.component.scss'
})
export class PurchaseFromThirdPartyComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  thirdPartyDetailsList: any[] = [];
  productList: any[] = [];
  saleProductsList: any[] = [];

  async ngOnInit() {
    this.getThirdPartyList();
    this.getProductList();
    this.findBillNo();
    this.getSalesProductList(this.today);
  }

  constructor(
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private router: Router,
    private tHMSVC: thirdPartyMasterService,
    private cdRef: ChangeDetectorRef,
    private rpPSvc: purchaseFromThirdPartyService,
    private pSvc: productMasterService
  ) { }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getProductList() {
    this.pSvc.getList(this.companyID).subscribe((res) => {
      this.productList = res
    })
  }

  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.suggestions = res;
    });
  }

  suggest(value: any) {
    this.suggestions = this.thirdPartyDetailsList.filter(item =>
      item.party_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1) this.suggestions = this.thirdPartyDetailsList
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
    this.purchaseThirdPartyForm.get('third_partyid')?.setValue(id);
    const Control = this.purchaseThirdPartyForm.get(
      'sale_nested'
    ) as FormArray;
    Control.value.forEach((element: any, i: number) => {
      this.colculation(i);
    });
    this.someMethod(); // Trigger change detection

  }

  async findBillNo(): Promise<void> {
    this.rpPSvc.getMaxId(this.companyID).subscribe((data) => {
      let maxnumber = 0;
      if (data.length > 0) {
        maxnumber = data[0].purchaseid + 1;
        if (maxnumber < 10) {
          this.purchaseThirdPartyForm.get('bill_no')?.setValue('0' + String(maxnumber));
        }
        else {
          this.purchaseThirdPartyForm.get('bill_no')?.setValue(String(maxnumber));
        }
      }
    });
  }

  purchaseThirdPartyForm = new FormGroup({
    purchaseid: new FormControl(0),
    third_partyid: new FormControl(null),
    date: new FormControl(''),
    bill_no: new FormControl(''),
    total: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
    sale_nested: new FormArray([
      new FormGroup({
        purchase_n_id: new FormControl(0),
        productid: new FormControl(null),
        gst_percentage: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
        price: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        discount: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        qty: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
        total: new FormControl(''),
        cgst_amount: new FormControl(''),
        sgst_amount: new FormControl(''),
        igst_amount: new FormControl(''),
        net_total: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
      }),
    ]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (this.purchaseThirdPartyForm.get('sale_nested') as FormArray).controls;
  }

  getProductControl(index: number): FormControl {
    const control = (
      this.purchaseThirdPartyForm.get('sale_nested') as FormArray
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
      this.purchaseThirdPartyForm.get('sale_nested') as FormArray
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
      this.purchaseThirdPartyForm.get('sale_nested') as FormArray
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
      this.purchaseThirdPartyForm.get('sale_nested') as FormArray
    )
      .at(index)?.get('qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }

  getgstPerControl(index: number): FormControl {
    const control = (
      this.purchaseThirdPartyForm.get('sale_nested') as FormArray
    )
      .at(index)?.get('gst_percentage') as FormControl;
    return control;
  }

  isgstperControlInvalid(index: number): boolean {
    const control = this.getgstPerControl(index);
    return control.touched && !!control.errors;
  }

  addNesForm() {
    const newControl = new FormGroup({
      purchase_n_id: new FormControl(0),
      productid: new FormControl(null),
      gst_percentage: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
      price: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      discount: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      qty: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
      total: new FormControl(''),
      cgst_amount: new FormControl(''),
      sgst_amount: new FormControl(''),
      igst_amount: new FormControl(''),
      net_total: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
    });
    (this.purchaseThirdPartyForm.get('sale_nested') as FormArray).push(
      newControl
    );
    this.someMethod(); // Trigger change detection
  }

  removeNesForm(index: number) {
    (this.purchaseThirdPartyForm.get('sale_nested') as FormArray).removeAt(
      index
    );

    this.finalCalculation();
    this.someMethod(); // Trigger change detection
  }

  setHsn(i: any) {
    const Control = this.purchaseThirdPartyForm.get('sale_nested') as FormArray;
    const proID = Control.at(i).get('productid')?.value;
    const newGSTDet = this.productList.find((e) => { return e.productid == proID });
    Control.at(i).get('price')?.setValue(newGSTDet.price);
    Control.at(i).get('gst_percentage')?.setValue(newGSTDet.gst_percentage);

    this.colculation(i);
  }

  colculation(i: any) {
    const Control = this.purchaseThirdPartyForm.get('sale_nested') as FormArray;
    const price = Number(Control.at(i).get('price')?.value);
    const discount = Number(Control.at(i).get('discount')?.value);
    if (Number(discount) > 100) {
      Control.at(i).get('discount')?.setValue('');
    }
    const disAmount = price - (price * discount) / 100;
    const qty = Number(Control.at(i).get('qty')?.value);
    Control.at(i).get('total')?.setValue(String((disAmount * qty).toFixed(2)));

    const sutotal = Number(Control.at(i).get('total')?.value);
    const gst = Number(Control.at(i).get('gst_percentage')?.value);
    const stateCode = this.thirdPartyDetailsList.find((e) => { return e.third_partyid == this.purchaseThirdPartyForm.value.third_partyid });
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
    const Control = this.purchaseThirdPartyForm.get('sale_nested') as FormArray;
    const FormTotal = Control.value.reduce((acc: any, val: any) => (acc += Number(val.net_total)), 0);
    this.purchaseThirdPartyForm.get('total')?.setValue(String(FormTotal.toFixed(2)));
  }

  async save() {
    if (this.purchaseThirdPartyForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed().toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.purchaseThirdPartyForm.value;
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
      this.purchaseThirdPartyForm.markAllAsTouched();
    }
  }

  async update(item: any) {
    const nestedArray = await this.rpPSvc.getSalesNestedLists(item.purchaseid).toPromise();

    const control = <FormArray>(this.purchaseThirdPartyForm.controls['sale_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.purchaseThirdPartyForm.patchValue(item);
      this.purchaseThirdPartyForm.get('cuid')?.setValue(this.userID);

      nestedArray?.forEach(async (e, i) => {
        const newControl = new FormGroup({
          purchase_n_id: new FormControl(e.purchase_n_id),
          productid: new FormControl(e.productid),
          gst_percentage: new FormControl(e.gst_percentage, [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
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
          net_total: new FormControl(e.net_total, [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
        });
        (this.purchaseThirdPartyForm.get('sale_nested') as FormArray).push(newControl);
        this.someMethod();
      });
    }

    this.scrollToTableTop();
  }

  cancelClick() {
    this.purchaseThirdPartyForm.reset();
    const control = <FormArray>(
      this.purchaseThirdPartyForm.controls['sale_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.purchaseThirdPartyForm.get('purchaseid')?.setValue(0);
    this.purchaseThirdPartyForm.get('third_partyid')?.setValue(null);
    this.purchaseThirdPartyForm.get('date')?.setValue('');
    this.purchaseThirdPartyForm.get('bill_no')?.setValue('');
    this.purchaseThirdPartyForm.get('total')?.setValue('');
    this.purchaseThirdPartyForm.get('cuid')?.setValue(this.userID);
    this.purchaseThirdPartyForm.get('companyid')?.setValue(this.companyID);

    this.addNesForm();
    this.findBillNo();
    this.getSalesProductList(this.today);
  }

  deleteFun(id: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.rpPSvc.delete(id).subscribe((res) => {
            if (res?.status === 'Delete Success') {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
            else if (res?.status === 'Return') {
              this.notificationSvc.warn('This record cannot be deleted ! Because You have entered a return entry for this purchase')
            }
            else {
              this.notificationSvc.error('Something is wrong !')
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
