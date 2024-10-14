import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { multipleSalesBillingService } from 'src/app/api-service/Accounts/multipleSalesBilling.service';
import { salesBillingService } from 'src/app/api-service/Accounts/salesBilling.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { customerMasterService } from 'src/app/api-service/customerMaster.service';
import { salesBillgstReportService } from 'src/app/api-service/reports/salesBillgstReport.service';
import { DatePipe } from '@angular/common';
import { selectStockService } from 'src/app/api-service/Accounts/selectingstockdialog.service';
import { LoadingService } from 'src/app/api-service/loadingSpinner.service';
import { captchaDialogService } from 'src/app/api-service/captchaDialog.service';

@Component({
  selector: 'app-multiple-sales-billentry-gst',
  templateUrl: './multiple-sales-billentry-gst.component.html',
  styleUrl: './multiple-sales-billentry-gst.component.scss',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultipleSalesBillentryGSTComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  salesBillingList: any[] = [];
  stockTableList: any[] = [];
  filteredStock: any[] = [];
  checkthereRefArray: any[] = [];
  customerDetailsList: any[] = [];
  suggestions: any[] = [];
  newResultList: any[] = [];
  nestedArray: any[] = [];
  today = new Date().toISOString().slice(0, 10)
  async ngOnInit() {
    this.getCustomerList();
    this.findBillNo();
    this.getSalesBillingList(this.today);
  }

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private cMSvc: customerMasterService,
    private cdRef: ChangeDetectorRef,
    private sBSvc: salesBillingService,
    private mSBSvc: multipleSalesBillingService,
    private SBREGSTDSVC: salesBillgstReportService,
    private datePipe: DatePipe,
    private sSSvc: selectStockService,
    private spinner: LoadingService,
    private capDialog: captchaDialogService
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

  getSalesBillingList(dated: any) {
    this.salesBillingList = [];
    this.sBSvc.getSalesList(this.companyID, dated).subscribe((res: any) => {
      this.salesBillingList = res;
      this.cdRef.detectChanges();
    });
  }

  async findBillNo(): Promise<void> {
    this.sBSvc.getMaxId(this.companyID).subscribe((data) => {
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

  async checkStockBySICode(refval: any) {

    this.spinner.show();
    let spiltArray = refval.split(',');
    let refArray: any[] = [...new Set(spiltArray)];
    this.stockTableList = [];
    this.filteredStock = [];
    if (this.salesBillEntryForm.value.entryid == 0) {

      for (let i = 0; i < refArray.length; i++) {
        const Control = this.salesBillEntryForm.get('sales_bill_nested') as FormArray;
        const alredyExArray = Control.value;
        let allStockListg = await this.mSBSvc.getStockList(this.companyID, refArray[i]).toPromise();
        let filteredSecondArray = allStockListg?.filter((e) => { return Number(e.qty) > 0 });
        let getallStock = filteredSecondArray?.filter(item2 => !alredyExArray.some((item1: any) => item1.stockid == item2.stockid));

        let stockArray: any[] = [];
        if (getallStock?.length == 1) {
          stockArray = getallStock;
          this.stockTableList.push(...stockArray);
        }
        else if (Number(getallStock?.length) > 1) {
          this.spinner.hide();
          await this.sSSvc.openConfirmDialog(getallStock).afterClosed().toPromise().then((res) => {
            if (res.status) {
              stockArray = res.value;
              this.stockTableList.push(...stockArray);
            }
          });
          this.spinner.show();
        }
      }

      this.filteredStock = this.stockTableList.filter((item) => { return Number(item.qty) > 0 });
      const fqty = this.filteredStock.reduce((acc: any, val: any) => (acc += Number(val.qty)), 0);
      this.salesBillEntryForm.get('fqty')?.setValue(String(fqty));
      this.checkthereRefArray = refArray.map((id: any) => {
        return {
          id: id,
          isthere: this.stockTableList.some(
            (item) => item.si_code === id && Number(item.qty) > 0
          ),
        };
      });
    } else {
      for (let i = 0; i < refArray.length; i++) {
        const Control = this.salesBillEntryForm.get('sales_bill_nested') as FormArray;
        const alredyExArray = Control.value;
        let allStockListg = await this.mSBSvc.getStockList(this.companyID, refArray[i]).toPromise();
        let filteredSecondArray = allStockListg?.filter((e) => { return Number(e.qty) > 0 });
        let alredy = this.nestedArray.filter((e) => { return e.si_code == refArray[i] });
        let combinedArray = filteredSecondArray?.concat(alredy);

        let getallStock = combinedArray?.filter(item2 => !alredyExArray.some((item1: any) => item1.stockid == item2.stockid));

        let stockArray: any[] = [];
        if (getallStock?.length == 1) {
          stockArray = getallStock;
          this.stockTableList.push(...stockArray);
        }
        else if (Number(getallStock?.length) > 1) {
          this.spinner.hide();
          await this.sSSvc.openConfirmDialog(getallStock).afterClosed().toPromise().then((res) => {
            if (res.status) {
              stockArray = res.value;
              this.stockTableList.push(...stockArray);
            }
          });
          this.spinner.show();
        }
      }

      this.filteredStock = this.stockTableList.filter((item) => { return Number(item.qty) > 0; });
      const fqty = this.filteredStock.reduce((acc: any, val: any) => (acc += Number(val.qty)), 0);
      this.salesBillEntryForm.get('fqty')?.setValue(String(fqty));
      this.checkthereRefArray = refArray.map((id: any) => {
        return {
          id: id,
          isthere: this.stockTableList.some(
            (item) => item.si_code === id && Number(item.qty) > 0
          ),
        };
      });
    }
    this.spinner.hide();
  }

  async moveAdd() {
    if (this.salesBillEntryForm.value.fprice && this.salesBillEntryForm.value.fdiscount && Number(this.salesBillEntryForm.value.fqty) > 0)
      for (let i = 0; i < this.filteredStock.length; i++) {
        const e = this.filteredStock[i];
        const newControl = new FormGroup({
          entry_n_id: new FormControl(e.entry_n_id),
          stockid: new FormControl(e.stockid),
          ref_code: new FormControl(e.ref_code),
          si_code: new FormControl(e.si_code),
          brandid: new FormControl(e.brandid),
          itemid: new FormControl(e.itemid),
          hsn_number: new FormControl(e.hsn_number),
          gst_percentage: new FormControl(e.gst_percentage),
          price: new FormControl(this.salesBillEntryForm.value.fprice),
          discount: new FormControl(this.salesBillEntryForm.value.fdiscount),
          qty: new FormControl(e.qty),
          total: new FormControl(''),
          cgst_amount: new FormControl(''),
          sgst_amount: new FormControl(''),
          igst_amount: new FormControl(''),
          net_total: new FormControl(''),
        });
        (this.salesBillEntryForm.get('sales_bill_nested') as FormArray).push(
          newControl
        );
        if (this.filteredStock.length == i + 1) {
          this.salesBillEntryForm.get('si_codes')?.setValue('');
          this.salesBillEntryForm.get('fqty')?.setValue('');
          this.salesBillEntryForm.get('fprice')?.setValue('');
          this.stockTableList = [];
          this.filteredStock = [];
          this.checkthereRefArray = [];
        }
        const Control = this.salesBillEntryForm.get(
          'sales_bill_nested'
        ) as FormArray;
        Control.value.forEach(async (element: any, ii: number) => {
          await this.colculation(ii);
        });
        this.someMethod();
      }
    else {
      this.notificationSvc.error('Invalid Details')
    }
  }

  async colculation(i: any): Promise<void> {
    const Control = this.salesBillEntryForm.get('sales_bill_nested') as FormArray;
    const price = Number(Control.at(i).get('price')?.value);
    const discount = Number(Control.at(i).get('discount')?.value);

    const disAmount = price - (price * discount) / 100;
    const qty = Number(Control.at(i).get('qty')?.value);
    Control.at(i).get('total')?.setValue(String((disAmount * qty).toFixed(2)));

    const total = Number(Control.at(i).get('total')?.value);
    const gst = Number(Control.at(i).get('gst_percentage')?.value);
    const newArray = this.customerDetailsList.filter((e) => {
      return e.customerid == this.salesBillEntryForm.value.customerid;
    });
    if (newArray.length > 0) {
      if (newArray[0].state_code == '33') {
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

    await this.finalCalculation();
  }

  async finalCalculation(): Promise<void> {
    const Control = this.salesBillEntryForm.get('sales_bill_nested') as FormArray;

    const FormTotal = Control.value.reduce((acc: any, val: any) => (acc += Number(val.net_total)), 0);
    this.salesBillEntryForm.get('total')?.setValue(String(FormTotal.toFixed(2)));

    const FormTot = Control.value.reduce(
      (acc: any, val: any) => (acc += Number(val.total)),
      0
    );
    this.salesBillEntryForm.get('ftot')?.setValue(String(FormTot.toFixed(2)));

    const fcgstamount = Control.value.reduce(
      (acc: any, val: any) => (acc += Number(val.cgst_amount)),
      0
    );
    this.salesBillEntryForm.get('fcgst_amount')?.setValue(String(fcgstamount.toFixed(2)));

    const fsgstamount = Control.value.reduce(
      (acc: any, val: any) => (acc += Number(val.sgst_amount)),
      0
    );
    this.salesBillEntryForm.get('fsgst_amount')?.setValue(String(fsgstamount.toFixed(2)));

    const figstamount = Control.value.reduce(
      (acc: any, val: any) => (acc += Number(val.igst_amount)),
      0
    );
    this.salesBillEntryForm.get('figst_amount')?.setValue(String(figstamount.toFixed(2)));
    interface GroupedItem {
      sicode: string;
      qty: number;
      discount: number;
      price: number;
      total: number;
    }

    // Grouping based on the combination of price and discount
    const groupedMap = new Map<string, GroupedItem>();

    Control.value.forEach((item: any) => {
      const key = `${Number(item.price)}_${Number(item.discount)}`;
      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          sicode: item.si_code,
          qty: Number(item.qty),
          price: Number(item.price),
          discount: Number(item.discount), // Add discount property
          total: Number(item.total),
        });
      } else {
        const existingItem = groupedMap.get(key)!;
        existingItem.sicode += `,${item.si_code}`;
        existingItem.qty += Number(item.qty);
        existingItem.total += Number(item.total);
      }
    });

    // Convert map values to array of GroupedItem
    const groupedArray: GroupedItem[] = Array.from(groupedMap.values());

    this.newResultList = groupedArray;
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

  async getReport(entryid: number) {
    const multipleSalesList = await this.sBSvc.getMultipleSalesReport(entryid).toPromise();
    this.SBREGSTDSVC.openConfirmDialog(multipleSalesList)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
        }
      });
  }

  salesBillEntryForm = new FormGroup({
    entryid: new FormControl(0),
    customerid: new FormControl(null),
    date: new FormControl(''),
    bill_no: new FormControl(''),
    balance: new FormControl(''),
    billing_address: new FormControl(''),
    shipping_address: new FormControl(''),

    credit_days: new FormControl(''),
    si_codes: new FormControl(''),
    fqty: new FormControl(''),
    fprice: new FormControl(''),
    fdiscount: new FormControl('0'),
    ftot: new FormControl(''),
    fcgst_amount: new FormControl(''),
    fsgst_amount: new FormControl(''),
    figst_amount: new FormControl(''),
    total: new FormControl('', [Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
    sales_bill_nested: new FormArray([]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (this.salesBillEntryForm.get('sales_bill_nested') as FormArray)
      .controls;
  }

  async save() {
    if (this.salesBillEntryForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        if (this.salesBillEntryForm.value.entryid == 0) {
          await this.findBillNo();
        }
        var value = this.salesBillEntryForm.value;
        this.sBSvc.addNew(value).subscribe((res) => {
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

  async cancelClick() {
    this.stockTableList = [];
    this.salesBillEntryForm.reset();
    const control = this.salesBillEntryForm.get(
      'sales_bill_nested'
    ) as FormArray<any>;
    while (control.length !== 0) {
      control.removeAt(0);
    }
    this.filteredStock = [];
    this.checkthereRefArray = [];
    this.newResultList = [];
    this.nestedArray = [];

    this.salesBillEntryForm.get('entryid')?.setValue(0);
    this.salesBillEntryForm.get('customerid')?.setValue(null);
    this.salesBillEntryForm.get('date')?.setValue('');
    this.salesBillEntryForm.get('bill_no')?.setValue('');
    this.salesBillEntryForm.get('balance')?.setValue('');
    this.salesBillEntryForm.get('billing_address')?.setValue('');
    this.salesBillEntryForm.get('shipping_address')?.setValue('');
    this.salesBillEntryForm.get('credit_days')?.setValue('');
    this.salesBillEntryForm.get('si_codes')?.setValue('');
    this.salesBillEntryForm.get('fqty')?.setValue('');
    this.salesBillEntryForm.get('fprice')?.setValue('');
    this.salesBillEntryForm.get('fdiscount')?.setValue('0');
    this.salesBillEntryForm.get('ftot')?.setValue('');
    this.salesBillEntryForm.get('fcgst_amount')?.setValue('');
    this.salesBillEntryForm.get('fsgst_amount')?.setValue('');
    this.salesBillEntryForm.get('figst_amount')?.setValue('');
    this.salesBillEntryForm.get('total')?.setValue('');
    this.salesBillEntryForm.get('cuid')?.setValue(this.userID);
    this.salesBillEntryForm.get('companyid')?.setValue(this.companyID);

    this.findBillNo();
    this.getSalesBillingList(this.today);
  }

  getFormattedDate(dateString: string): string | null {
    if (dateString) {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'dd-MM-yyyy');
    } else {
      return '';
    }
  }

  async update(item: any) {
    await this.cancelClick();
    const newArray = await this.sBSvc.getSalesNestedList(item.entryid).toPromise();
    this.nestedArray = newArray ?? [];
    const control = this.salesBillEntryForm.get('sales_bill_nested') as FormArray<any>;
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.salesBillEntryForm.patchValue(item);
      this.salesBillEntryForm.get('cuid')?.setValue(this.userID);

      this.nestedArray?.forEach(async (e, i) => {
        const newControl = new FormGroup({
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
          total: new FormControl(e.total),
          cgst_amount: new FormControl(e.cgst_amount),
          sgst_amount: new FormControl(e.sgst_amount),
          igst_amount: new FormControl(e.igst_amount),
          net_total: new FormControl(e.net_total),
        });
        (this.salesBillEntryForm.get('sales_bill_nested') as FormArray).push(
          newControl
        );
        this.someMethod();
      });

      const Controlset = this.salesBillEntryForm.get(
        'sales_bill_nested'
      ) as FormArray;
      Controlset.value.forEach(async (element: any, ii: number) => {
        await this.colculation(ii);
      });
      this.someMethod();
    }

    this.scrollToTableTop();
  }

  nestedit(value: any) {
    this.salesBillEntryForm.get('si_codes')?.setValue(value.sicode);
    this.salesBillEntryForm.get('fqty')?.setValue(String(value.qty));
    this.salesBillEntryForm.get('fprice')?.setValue(String(value.price));
    this.salesBillEntryForm.get('fdiscount')?.setValue(String(value.discount));

    const control = this.salesBillEntryForm.get('sales_bill_nested') as FormArray<any>;
    const siArray = value.sicode.split(',');
    siArray.forEach((e: any) => {
      removeItemBySiCode(e);
    });

    function removeItemBySiCode(si_code: string) {
      // Find the index of the item with the given si_code      
      const index = control.controls.findIndex(item => item.value.si_code === si_code && item.value.price == value.price && item.value.discount == value.discount);
      // Check if the item was found
      if (index !== -1) {
        // Remove the item from the FormArray
        control.removeAt(index);
      }
    }

    this.finalCalculation();
  }

  deleteFun(id: number) {
    this.capDialog.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.sBSvc.delete(id).subscribe((res) => {
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
