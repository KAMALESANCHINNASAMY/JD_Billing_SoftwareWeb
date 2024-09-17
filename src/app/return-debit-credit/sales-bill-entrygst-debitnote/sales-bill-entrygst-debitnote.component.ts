import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { salesBillingService } from 'src/app/api-service/Accounts/salesBilling.service';
import { salesBillingReturnService } from 'src/app/api-service/Credit-Debit-note/salesBillingReturnDebitgst.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { brandMasterService } from 'src/app/api-service/brandMaster.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { itemMasterService } from 'src/app/api-service/itemMaster.service';
import { salesBillgstReturnReportService } from 'src/app/api-service/reports/salesBillgstReturnReport.service';

@Component({
  selector: 'app-sales-bill-entrygst-debitnote',
  templateUrl: './sales-bill-entrygst-debitnote.component.html',
  styleUrl: './sales-bill-entrygst-debitnote.component.scss',
})
export class SalesBillEntrygstDebitnoteComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  customerDetailsList: any[] = [];
  suggestions: any[] = [];
  brandList: any[] = [];
  itemMasterList: any[] = [];
  newItemList: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  salesBillingDebitList: any[] = [];
  billNoList: any[] = [];
  billNoSuggestions: any[] = [];

  async ngOnInit() {
    this.findBillNo();
    this.getCustomerList();
    this.getBrandList();
    this.getItemMasterDetails();
    this.getSalesBillingDebitList(this.today);
    this.salesBillReturnDebitForm.get('return_date')?.setValue(this.today);
  }

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private cMSvc: customerMasterService,
    private cdRef: ChangeDetectorRef,
    private bSvc: brandMasterService,
    private ITMSRC: itemMasterService,
    private SBRSVC: salesBillingReturnService,
    private SBRRSVC: salesBillgstReturnReportService,
    private sBSvc: salesBillingService,
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
    this.salesBillReturnDebitForm.get('entryid')?.setValue(null);
    const getBillList = await this.SBRSVC.getSalesBillingByCustomerID(id, this.companyID).toPromise();
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

  async setSalesDetails(value: number) {
    const nestedArray = await this.sBSvc.getSalesNestedList(value).toPromise();
    const control = <FormArray><unknown>(this.salesBillReturnDebitForm.controls['sales_billReturnDebit_nested']);
    if (nestedArray?.length != 0) {
      while (control.length !== 0) {
        control.removeAt(0);
      }
      if (control.length == 0) {
        const formVal = this.billNoList.filter((e) => { return e.entryid == value });
        this.salesBillReturnDebitForm.get('bill_date')?.setValue(formVal[0].date);
        this.salesBillReturnDebitForm.get('total')?.setValue(formVal[0].total);
        this.salesBillReturnDebitForm.get('invoice_no')?.setValue(formVal[0].bill_no);

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
            gst_percentage: new FormControl(e.gst_percentage),
            price: new FormControl(e.price),
            discount: new FormControl(e.discount),
            qty: new FormControl(e.qty),
            return_qty: new FormControl('', [
              Validators.required,
              Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            total: new FormControl(e.total),
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
          (this.salesBillReturnDebitForm.get('sales_billReturnDebit_nested') as FormArray).push(
            newControl
          );
          this.someMethod();
        });
      }
    }
  }

  async findBillNo(): Promise<void> {
    const data: any = await this.SBRSVC.getMaxId(this.companyID).toPromise();
    let maxnumber = 0;
    if (data.length > 0 && this.salesBillReturnDebitForm.value.returndebit_id == 0) {
      maxnumber = data[0].entryid + 1;
      if (maxnumber < 10) {
        this.salesBillReturnDebitForm.get('return_no')?.setValue('0' + String(maxnumber));
      }
      else {
        this.salesBillReturnDebitForm.get('return_no')?.setValue(String(maxnumber));
      }
    }
  }

  salesBillReturnDebitForm = new FormGroup({
    returndebit_id: new FormControl(0),
    customerid: new FormControl(null),
    entryid: new FormControl(null),
    invoice_no: new FormControl(''),
    bill_date: new FormControl(''),
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
      //   return_qty: new FormControl('', [
      //     Validators.required,
      //     Validators.pattern(/^\d+(\.\d{1,2})?$/),
      //   ]),      
      //   total: new FormControl(''),
      //   return_total: new FormControl(''),
      //   cgst_amount: new FormControl(''),
      //   return_cgst_amount: new FormControl(''),
      //   sgst_amount: new FormControl(''),
      //   return_sgst_amount: new FormControl(''),
      //   igst_amount: new FormControl(''),
      //   return_igst_amount: new FormControl(''),
      //   net_total: new FormControl(''),
      //   return_net_total: new FormControl(''),
      // }),
    ]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (
      this.salesBillReturnDebitForm.get(
        'sales_billReturnDebit_nested'
      ) as FormArray
    ).controls;
  }

  getQtyControl(index: number): FormControl {
    const control = (this.salesBillReturnDebitForm.get('sales_billReturnDebit_nested') as FormArray).at(index)?.get('return_qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }

  getSiCodeControl(index: number): FormControl {
    const control = (
      this.salesBillReturnDebitForm.get(
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

  colculation(i: any) {
    const Control = this.salesBillReturnDebitForm.get('sales_billReturnDebit_nested') as FormArray;
    const price = Number(Control.at(i).get('price')?.value);
    const discount = Number(Control.at(i).get('discount')?.value);
    if (Number(discount) > 100) {
      Control.at(i).get('discount')?.setValue('');
    }
    if (Number(Control.at(i).get('return_qty')?.value) > Number(Control.at(i).get('qty')?.value)) {
      Control.at(i)
        .get('return_qty')
        ?.setValue(Control.at(i).get('qty')?.value);
      this.notificationSvc.error('Invalid QTY!');
    }

    const disAmount = price - (price * discount) / 100;
    const qty = Number(Control.at(i).get('return_qty')?.value);
    Control.at(i).get('return_total')?.setValue(String((disAmount * qty).toFixed(2)));

    const total = Number(Control.at(i).get('return_total')?.value);
    const gst = Number(Control.at(i).get('gst_percentage')?.value);
    const newArray = this.customerDetailsList.filter((e) => {
      return e.customerid == this.salesBillReturnDebitForm.value.customerid;
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
    const Control = this.salesBillReturnDebitForm.get(
      'sales_billReturnDebit_nested'
    ) as FormArray;
    const FormTotal = Control.value.reduce(
      (acc: any, val: any) => (acc += Number(val.net_total)),
      0
    );
    this.salesBillReturnDebitForm.get('total')?.setValue(String(FormTotal.toFixed(2)));

    const FormReturnTotal = Control.value.reduce(
      (acc: any, val: any) => (acc += Number(val.return_net_total)),
      0);

    this.salesBillReturnDebitForm.get('return_total')?.setValue(String(FormReturnTotal.toFixed(2)));
  }

  async save() {
    if (this.salesBillReturnDebitForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.salesBillReturnDebitForm.value;
        this.SBRSVC.addNew(value).subscribe((res) => {
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
      this.salesBillReturnDebitForm.markAllAsTouched();
      this.notificationSvc.error('Some required input are missing!');
    }
  }

  getSalesBillingDebitList(dated: any) {
    this.SBRSVC.getSalesBillingDebitList(this.companyID, dated).subscribe(
      (res: any) => {
        this.salesBillingDebitList = res;
        this.cdRef.detectChanges();
      }
    );
  }

  async getReport(item: any) {
    const nestedArray = await this.SBRSVC.getSalesBillingDebitNestedList(item.returndebit_id).toPromise();
    this.SBRRSVC.openConfirmDialog(item, nestedArray).afterClosed().subscribe((res) => {
      if (res == true) {
      }
    });
  }

  async update(item: any) {
    await this.cancelClick();
    await this.setCustomerDetails(item.customerid)
    const nestedArray = await this.SBRSVC.getSalesBillingDebitNestedList(item.returndebit_id).toPromise();
    const control = <FormArray><unknown>(this.salesBillReturnDebitForm.controls['sales_billReturnDebit_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.salesBillReturnDebitForm.patchValue(item);
      this.salesBillReturnDebitForm.get('cuid')?.setValue(this.userID);

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
          stockid: new FormControl(e.stockid),
          ref_code: new FormControl(e.ref_code),
          si_code: new FormControl(e.si_code),
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
          return_qty: new FormControl(e.return_qty, [
            Validators.required,
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
          ]),
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
        (
          this.salesBillReturnDebitForm.get(
            'sales_billReturnDebit_nested'
          ) as FormArray
        ).push(newControl);
        this.someMethod();
      });
    }
  }

  async cancelClick() {
    this.salesBillReturnDebitForm.reset();
    const control = <FormArray><unknown>(this.salesBillReturnDebitForm.controls['sales_billReturnDebit_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.salesBillReturnDebitForm.get('returndebit_id')?.setValue(0);
    this.salesBillReturnDebitForm.get('customerid')?.setValue(null);
    this.salesBillReturnDebitForm.get('bill_date')?.setValue('');
    this.salesBillReturnDebitForm.get('invoice_no')?.setValue('');
    this.salesBillReturnDebitForm.get('entryid')?.setValue(null);
    this.salesBillReturnDebitForm.get('invoice_date')?.setValue('');
    this.salesBillReturnDebitForm.get('return_no')?.setValue('');
    this.salesBillReturnDebitForm.get('return_date')?.setValue(this.today);
    this.salesBillReturnDebitForm.get('return_total')?.setValue('');
    this.salesBillReturnDebitForm.get('total')?.setValue('');
    this.salesBillReturnDebitForm.get('cuid')?.setValue(this.userID);
    this.salesBillReturnDebitForm.get('companyid')?.setValue(this.companyID);

    this.getCustomerList();
    this.getSalesBillingDebitList(this.today);
    await this.findBillNo();
  }
}
