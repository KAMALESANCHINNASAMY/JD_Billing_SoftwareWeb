import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { brandMasterService } from 'src/app/api-service/brandMaster.service';
import { itemMasterService } from 'src/app/api-service/itemMaster.service';
import { SupplierMasterService } from 'src/app/api-service/supplierMaster.service';
import { SupplierDebitNoteService } from 'src/app/api-service/Accounts/supplierDebitNote.service';
import { RawMaterialReturnReportService } from 'src/app/api-service/reports/rawMaterialReturnReport.service';

@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrl: './debit-note.component.scss',
})
export class DebitNoteComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  supplierDetailsList: any[] = [];
  suggestions: any[] = [];
  brandList: any[] = [];
  itemMasterList: any[] = [];
  newItemList: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  RawMaterialPurchaseList: any[] = [];
  supplierDebitList: any[] = [];

  constructor(
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private router: Router,
    private sMSvc: SupplierMasterService,
    private cdRef: ChangeDetectorRef,
    private bSvc: brandMasterService,
    private ITMSRC: itemMasterService,
    private SPBNSVC: SupplierDebitNoteService,
    private RMPRREPSVC: RawMaterialReturnReportService
  ) { }
  ngOnInit() {
    this.getSupplierList();
    this.getBrandList();
    this.getItemMasterDetails();
    this.getSupplierDebitList(this.today);
    this.findBillNo();
  }

  getSupplierList() {
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

  getSupplierDebitList(dated: any) {
    this.SPBNSVC.getSupplierDebitDetails(this.companyID, dated).subscribe(
      (res: any) => {
        this.supplierDebitList = res;
        this.cdRef.detectChanges();
      }
    );
  }

  setSupplierDetails(id: any) {
    this.SupplierDebitForm.get('purchaseid')?.setValue(null);
    this.RawMaterialPurchaseList = []
    this.SPBNSVC.getRawMatDetailsPurchased(this.companyID, id).subscribe((res) => {
      this.RawMaterialPurchaseList = res;
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
    const data: any = await this.SPBNSVC.getMaxId(this.companyID).toPromise();
    let maxnumber = 0;
    if (Number(data.length) > 0 && this.SupplierDebitForm.value.s_debitid == 0) {
      maxnumber = data[0].s_debitid + 1;
      if (maxnumber < 10) {
        this.SupplierDebitForm.get('return_no')?.setValue('0' + String(maxnumber));
      } else {
        this.SupplierDebitForm.get('return_no')?.setValue(String(maxnumber));
      }
    }
  }

  async onBillNoSelected(purchaseid: any) {
    const RawMaterialPuchaseNestedList = await this.SPBNSVC.getRawmatPBySupbno(this.companyID, purchaseid).toPromise();
    const control = <FormArray><unknown>(
      this.SupplierDebitForm.controls['SupplierDebit_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      if (RawMaterialPuchaseNestedList && RawMaterialPuchaseNestedList.length > 0) {
        this.SupplierDebitForm.patchValue(RawMaterialPuchaseNestedList[0]);
      }
      this.SupplierDebitForm.get('cuid')?.setValue(this.userID);
      RawMaterialPuchaseNestedList?.forEach(async (e, i) => {
        const filteredItems = this.itemMasterList.filter(
          (ee) => ee.brandid == e.brandid
        );
        // Assign filtered list to newItemList for the corresponding index
        if (filteredItems && filteredItems.length > 0) {
          this.newItemList[e.brandid] = filteredItems;
        }

        const newControl = new FormGroup({
          purchase_n_id: new FormControl(e.purchase_n_id),
          s_debitid: new FormControl(e.s_debitid),
          brandid: new FormControl(e.brandid),
          itemid: new FormControl(e.itemid),
          hsn_number: new FormControl(e.hsn_number),
          gst_percentage: new FormControl(e.gst_percentage),
          price: new FormControl(e.price),
          discount: new FormControl(e.discount),
          qty: new FormControl(e.qty),
          return_qty: new FormControl('', [
            Validators.required,
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
          ]),
          total: new FormControl(e.rmpntotal),
          return_total: new FormControl(''),
          cgst_amount: new FormControl(e.cgst_amount),
          return_cgst_amount: new FormControl(''),
          sgst_amount: new FormControl(e.sgst_amount),
          return_sgst_amount: new FormControl(''),
          igst_amount: new FormControl(e.igst_amount),
          return_igst_amount: new FormControl(''),
          net_total: new FormControl(e.net_total),
          return_net_total: new FormControl(''),
        });
        (this.SupplierDebitForm.get('SupplierDebit_nested') as FormArray).push(
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
    s_debitid: new FormControl(0),
    purchaseid: new FormControl(null),
    supplierid: new FormControl(null),
    supplier_bill_no: new FormControl('', [Validators.required]),
    return_no: new FormControl(''),
    return_date: new FormControl(''),
    date: new FormControl(''),
    gst_in: new FormControl(''),
    total: new FormControl(''),
    return_total: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    SupplierDebit_nested: new FormArray([
      // new FormGroup({
      //   s_debitid_n_id: new FormControl(0),
      //   purchase_n_id: new FormControl(0),
      //   s_debitid: new FormControl(0),
      //   brandid: new FormControl(null),
      //   itemid: new FormControl(null),
      //   hsn_number: new FormControl(''),
      //   gst_percentage: new FormControl(''),
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
      //   return_qty: new FormControl(''),
      //   total: new FormControl(''),
      //   return_total: new FormControl(''),
      //   cgst_amount: new FormControl(''),
      //   return_cgst_amount: new FormControl(''),
      //   sgst_amount: new FormControl(''),
      //   return_sgst_amount: new FormControl(),
      //   igst_amount: new FormControl(''),
      //   return_igst_amount: new FormControl(''),
      //   net_total: new FormControl(''),
      //   return_net_total: new FormControl(),
      // }),
    ]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (this.SupplierDebitForm.get('SupplierDebit_nested') as FormArray).controls;
  }

  getQtyControl(index: number): FormControl {
    const control = (this.SupplierDebitForm.get('SupplierDebit_nested') as FormArray).at(index)?.get('return_qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
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
        this.SPBNSVC.addNew(value).subscribe((res) => {
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

  async getReport(item: any) {
    const nestedArray = await this.SPBNSVC.getSupplierDebitNestedLists(item.s_debitid).toPromise();
    const filteredArray = nestedArray?.filter((e) => { return Number(e.return_qty) > 0 })
    this.RMPRREPSVC.openConfirmDialog(item, filteredArray)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
        }
      });
  }

  async update(item: any) {
    await this.cancelClick();
    const nestedArray = await this.SPBNSVC.getSupplierDebitNestedLists(item.s_debitid).toPromise();

    const control = <FormArray><unknown>(
      this.SupplierDebitForm.controls['SupplierDebit_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.SupplierDebitForm.patchValue(item);
      this.SupplierDebitForm.get('cuid')?.setValue(this.userID);
      this.SupplierDebitForm.get('supplier_bill_no')?.setValue(item.supplier_bill_no);
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
          s_debitid_n_id: new FormControl(e.s_debitid_n_id),
          brandid: new FormControl(e.brandid),
          itemid: new FormControl(e.itemid),
          hsn_number: new FormControl(e.hsn_number),
          gst_percentage: new FormControl(e.gst_percentage),
          price: new FormControl(e.price),
          discount: new FormControl(e.discount),
          qty: new FormControl(e.qty, [
            Validators.required,
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
          ]),
          return_qty: new FormControl(e.return_qty),
          total: new FormControl(e.total),
          return_total: new FormControl(e.return_total),
          cgst_amount: new FormControl(e.cgst_amount),
          return_cgst_amount: new FormControl(e.return_cgst_amount),
          sgst_amount: new FormControl(e.sgst_amount),
          return_sgst_amount: new FormControl(e.return_sgst_amount),
          igst_amount: new FormControl(e.igst_amount),
          return_igst_amount: new FormControl(e.return_igst_amount),
          net_total: new FormControl(e.net_total),
          return_net_total: new FormControl(e.return_net_total),
        });
        (this.SupplierDebitForm.get('SupplierDebit_nested') as FormArray).push(
          newControl
        );
        this.someMethod();
      });
    }
  }

  colculation(i: any) {
    const Control = this.SupplierDebitForm.get(
      'SupplierDebit_nested'
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

    const total = Number(Control.at(i).get('return_total')?.value);
    const gst = Number(Control.at(i).get('gst_percentage')?.value);
    const newArray = this.supplierDetailsList.filter((e) => {
      return e.supplierid == this.SupplierDebitForm.value.supplierid;
    });
    if (newArray.length > 0) {
      if (newArray[0].state_code == '33') {
        Control.at(i).get('return_cgst_amount')?.setValue(String((((total * gst) / 100) * 0.5).toFixed(2)));
        Control.at(i).get('return_sgst_amount')?.setValue(String((((total * gst) / 100) * 0.5).toFixed(2)));
        Control.at(i).get('return_igst_amount')?.setValue('0');
      } else {
        Control.at(i).get('return_igst_amount')?.setValue(String(((total * gst) / 100).toFixed(2)));
        Control.at(i).get('return_cgst_amount')?.setValue('0');
        Control.at(i).get('return_sgst_amount')?.setValue('0');
      }
    }

    const cgst = Number(Control.at(i).get('return_cgst_amount')?.value);
    const sgst = Number(Control.at(i).get('return_sgst_amount')?.value);
    const igst = Number(Control.at(i).get('return_igst_amount')?.value);

    Control.at(i).get('return_net_total')?.setValue(String((total + cgst + sgst + igst).toFixed(2)));

    this.finalCalculation();
  }

  async finalCalculation() {
    const Control = this.SupplierDebitForm.get('SupplierDebit_nested') as FormArray;

    const FormTotal = Control.value.reduce((acc: number, val: any) => (acc += Number(val.net_total)), 0);
    this.SupplierDebitForm.get('total')?.setValue(String(FormTotal.toFixed(2)));

    const FormReturnTotal = Control.value.reduce((acc: number, val: any) => (acc += Number(val.return_net_total)), 0);
    this.SupplierDebitForm.get('return_total')?.setValue(String(FormReturnTotal.toFixed(2)));
  }

  async cancelClick() {
    this.SupplierDebitForm.reset();
    const control = <FormArray><unknown>(
      this.SupplierDebitForm.controls['SupplierDebit_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.SupplierDebitForm.get('s_debitid')?.setValue(0);
    this.SupplierDebitForm.get('supplierid')?.setValue(null);
    this.SupplierDebitForm.get('return_date')?.setValue('');
    this.SupplierDebitForm.get('date')?.setValue('');
    this.SupplierDebitForm.get('gst_in')?.setValue('');
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
