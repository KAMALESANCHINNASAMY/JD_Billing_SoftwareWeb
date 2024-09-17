import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
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
import { thirdPartyGSTPurchaseService } from 'src/app/api-service/Accounts/thirdPartyGstPurchase.service';
import { thirdPartyPurchaseService } from 'src/app/api-service/Accounts/thirdPartyPurchase.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { brandMasterService } from 'src/app/api-service/brandMaster.service';
import { financialYearService } from 'src/app/api-service/financialYear.service';
import { itemMasterService } from 'src/app/api-service/itemMaster.service';
import { ThirdPartyPurchaseReportService } from 'src/app/api-service/reports/thirdPartygstPurchaseReport.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';

@Component({
  selector: 'app-third-party-sareesgst-purchase',
  templateUrl: './third-party-sareesgst-purchase.component.html',
  styleUrl: './third-party-sareesgst-purchase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThirdPartySareesgstPurchaseComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  suggestions: any[] = [];
  brandList: any[] = [];
  itemMasterList: any[] = [];
  newItemList: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  thirdPartyPurchaseList: any[] = [];
  shortCode: string = '';
  ActiveFinYr: any[] = [];
  aFfromdate: string = String(localStorage.getItem('fromdate'));
  aFtodate: string = String(localStorage.getItem('todate'));

  isDateInRange(today: string, fromdate: string, todate: string): boolean {
    const todayDate = new Date(today);
    const fromDate = new Date(fromdate);
    const toDate = new Date(todate);

    // Check if today is not between fromdate and todate
    return !(todayDate >= fromDate && todayDate <= toDate);
  }

  ngOnInit(): void {
    this.getActiveFinYr();
    this.getThirdPartyList();
    this.getBrandList();
    this.getItemMasterDetails();
    this.findBillNo();
    this.findSiCode();
    this.findRefCode();
    this.getThirdPartPurchaseList(this.today);
  }

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private tHMSVC: thirdPartyMasterService,
    private bSvc: brandMasterService,
    private ITMSRC: itemMasterService,
    private cdRef: ChangeDetectorRef,
    private tPGSTPSvc: thirdPartyGSTPurchaseService,
    private tPPSvc: thirdPartyPurchaseService,
    private FINYRSVC: financialYearService,
    private TPGSTRSVC: ThirdPartyPurchaseReportService
  ) { }

  getBrandList() {
    this.bSvc.getList(this.companyID).subscribe((res: any) => {
      this.brandList = res;
    });
  }

  getActiveFinYr() {
    this.FINYRSVC.getActiveFinYear(this.companyID).subscribe((res: any) => {
      this.ActiveFinYr = res;
    });
  }

  getItemMasterDetails() {
    this.ITMSRC.getItemMasterList(this.companyID).subscribe((res) => {
      this.itemMasterList = res;
    });
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getThirdPartyList() {
    this.thirdPartyDetailsList = [];
    this.suggestions = [];
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.suggestions = res;
    });
  }

  setThirdPartyDetails(id: any) {
    const newArray = this.thirdPartyDetailsList.filter((e) => {
      return e.third_partyid == id;
    });
    if (newArray.length > 0) {
      this.thirdPartyForm.get('third_partyid')?.setValue(id);
      this.thirdPartyForm.get('c_balance')?.setValue(newArray[0].c_balance);
      this.thirdPartyForm.get('gst_in')?.setValue(newArray[0].gst_in)
      this.shortCode = newArray[0].short_code;

      const Control = this.thirdPartyForm.get('thirdparty_nested') as FormArray;
      Control.value.forEach((element: any, i: number) => {

        this.colculation(i);
      });
      this.someMethod(); // Trigger change detection
    }
  }

  suggest(value: any) {
    this.suggestions = this.thirdPartyDetailsList.filter((item) =>
      item.party_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.thirdPartyDetailsList;
  }

  async getItemchange(i: any): Promise<void> {
    const Control = this.thirdPartyForm.get('thirdparty_nested') as FormArray;
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
    const Control = this.thirdPartyForm.get('thirdparty_nested') as FormArray;
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

  getThirdPartPurchaseList(dated: any) {
    this.tPGSTPSvc
      .getThirdPartyPurchaseLists(this.companyID, dated)
      .subscribe((res: any) => {
        this.thirdPartyPurchaseList = res;
        this.cdRef.detectChanges();
      });
  }

  changeInputTwoDigit(i: number): void {
    const control = this.thirdPartyForm.get('thirdparty_nested') as FormArray;
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

  getSiControl(index: number): FormControl {
    const control = (this.thirdPartyForm.get('thirdparty_nested') as FormArray)
      .at(index)
      ?.get('si_code') as FormControl;
    return control;
  }

  isSiControlInvalid(index: number): boolean {
    const control = this.getSiControl(index);
    return control.touched && !!control.errors;
  }

  getBrandControl(index: number): FormControl {
    const control = (this.thirdPartyForm.get('thirdparty_nested') as FormArray)
      .at(index)
      ?.get('brandid') as FormControl;
    return control;
  }

  isBrandControlInvalid(index: number): boolean {
    const control = this.getBrandControl(index);
    return control.touched && !!control.errors;
  }

  getItemControl(index: number): FormControl {
    const control = (this.thirdPartyForm.get('thirdparty_nested') as FormArray)
      .at(index)
      ?.get('itemid') as FormControl;
    return control;
  }

  isItemControlInvalid(index: number): boolean {
    const control = this.getItemControl(index);
    return control.touched && !!control.errors;
  }

  getPriceControl(index: number): FormControl {
    const control = (this.thirdPartyForm.get('thirdparty_nested') as FormArray)
      .at(index)
      ?.get('price') as FormControl;
    return control;
  }

  isPriceControlInvalid(index: number): boolean {
    const control = this.getPriceControl(index);
    return control.touched && !!control.errors;
  }

  getDiscountControl(index: number): FormControl {
    const control = (this.thirdPartyForm.get('thirdparty_nested') as FormArray)
      .at(index)
      ?.get('discount') as FormControl;
    return control;
  }

  isDiscountControlInvalid(index: number): boolean {
    const control = this.getDiscountControl(index);
    return control.touched && !!control.errors;
  }

  getQtyControl(index: number): FormControl {
    const control = (this.thirdPartyForm.get('thirdparty_nested') as FormArray)
      .at(index)
      ?.get('qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }
  async findBillNo(): Promise<void> {
    this.tPGSTPSvc.getMaxId(this.companyID).subscribe((data) => {
      let maxnumber = 0;
      if (data.length > 0) {
        maxnumber = data[0].purchaseid + 1;
        if (maxnumber < 10) {
          this.thirdPartyForm
            .get('bill_no')
            ?.setValue('0' + String(maxnumber));
        } else {
          this.thirdPartyForm.get('bill_no')?.setValue(String(maxnumber));
        }
      }
    });
  }

  async findSiCode(): Promise<void> {
    this.tPPSvc.getThirdPartySICode(this.companyID).subscribe((data) => {
      let maxnumber = 0;
      if (data.length > 0) {
        const Control = this.thirdPartyForm.get(
          'thirdparty_nested'
        ) as FormArray;
        const newAlredyUpCount = Control.value.filter((eu: any) => {
          return eu.purchase_n_id > 0;
        });
        Control.value.forEach((element: any, i: number) => {
          if (Number(Control.at(i).get('purchase_n_id')?.value) == 0) {
            maxnumber = data[0].purchaseid + 1;
            if (maxnumber < 10 && (maxnumber + i - newAlredyUpCount.length) < 10) {
              Control.at(i)
                .get('si_code')
                ?.setValue(
                  '0' + String(maxnumber + i - newAlredyUpCount.length)
                );
            } else {
              Control.at(i)
                .get('si_code')
                ?.setValue(String(maxnumber + i - newAlredyUpCount.length));
            }
          }
        });
      }
    });
  }

  async findRefCode(): Promise<void> {
    this.tPPSvc
      .getThirdPartyRefCode(
        this.companyID,
        this.thirdPartyForm.value.third_partyid || 0
      )
      .subscribe((data) => {
        let maxnumber = 0;

        if (data.length > 0) {
          const Control = this.thirdPartyForm.get(
            'thirdparty_nested'
          ) as FormArray;
          const newAlredyUpCount = Control.value.filter((eu: any) => {
            return eu.purchase_n_id > 0;
          });
          Control.value.forEach((element: any, i: number) => {
            if (Number(Control.at(i).get('purchase_n_id')?.value) == 0) {
              maxnumber = data[0].purchaseid + 1;
              Control.at(i).get('ref_code')?.setValue(this.shortCode + String(maxnumber + i - newAlredyUpCount.length));
            }
          });
        }
      });
  }

  thirdPartyForm = new FormGroup({
    purchaseid: new FormControl(0),
    third_partyid: new FormControl(null),
    date: new FormControl(''),
    invoice_no: new FormControl(''),
    bill_no: new FormControl(''),
    gst_in: new FormControl(''),
    c_balance: new FormControl(''),
    credit_days: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    total: new FormControl(''),
    thirdparty_nested: new FormArray([
      new FormGroup({
        purchase_n_id: new FormControl(0),
        si_code: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
        ref_code: new FormControl(''),
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
    return (this.thirdPartyForm.get('thirdparty_nested') as FormArray).controls;
  }
  someMethod() {
    this.cdRef.detectChanges();
  }
  addNesForm() {
    const newControl = new FormGroup({
      purchase_n_id: new FormControl(0),
      si_code: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      ref_code: new FormControl(''),
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
    (this.thirdPartyForm.get('thirdparty_nested') as FormArray).push(
      newControl
    );
    this.finalCalculation();
    this.someMethod(); // Trigger change detection
  }

  removeNesForm(index: number) {
    (this.thirdPartyForm.get('thirdparty_nested') as FormArray).removeAt(index);

    this.finalCalculation();
    this.someMethod(); // Trigger change detection
  }

  colculation(i: any) {
    const Control = this.thirdPartyForm.get('thirdparty_nested') as FormArray;
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
    const newArray = this.thirdPartyDetailsList.filter((e) => {
      return e.third_partyid == this.thirdPartyForm.value.third_partyid;
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

  async finalCalculation() {
    const Control = this.thirdPartyForm.get('thirdparty_nested') as FormArray;
    const FormTotal = Control.value.reduce(
      (acc: any, val: any) => (acc += Number(val.net_total)),
      0
    );
    this.thirdPartyForm.get('total')?.setValue(String(FormTotal.toFixed(2)));

    await this.findSiCode();
    await this.findRefCode();
  }

  async save() {
    if (this.thirdPartyForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.thirdPartyForm.value;
        this.tPGSTPSvc.addNew(value).subscribe((res) => {
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
      this.thirdPartyForm.markAllAsTouched();
      this.notificationSvc.error('Some required input are missing!');
    }
  }

  async getReport(purchaseid: any) {
    const thirdPartygstPurchaseReports = await this.tPGSTPSvc
      .getThirdPartyPurchaseReport(purchaseid)
      .toPromise();
    this.TPGSTRSVC.openConfirmDialog(thirdPartygstPurchaseReports)
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
        }
      });
  }

  async update(item: any) {
    const nestedArray = await this.tPGSTPSvc
      .getThirdPartyPurchaseNestedLists(item.purchaseid)
      .toPromise();

    const control = <FormArray>(
      this.thirdPartyForm.controls['thirdparty_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.thirdPartyForm.patchValue(item);

      this.shortCode = item.short_code;
      this.thirdPartyForm.get('cuid')?.setValue(this.userID);

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
          si_code: new FormControl(e.si_code, [Validators.required, Validators.pattern('^[0-9]*$')]),
          ref_code: new FormControl(e.ref_code),
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
        (this.thirdPartyForm.get('thirdparty_nested') as FormArray).push(
          newControl
        );
        this.someMethod();
      });
    }

    this.scrollToTableTop();
  }

  cancelClick() {
    this.thirdPartyForm.reset();
    const control = <FormArray>(
      this.thirdPartyForm.controls['thirdparty_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.thirdPartyForm.get('purchaseid')?.setValue(0);
    this.thirdPartyForm.get('third_partyid')?.setValue(null);
    this.thirdPartyForm.get('date')?.setValue('');
    this.thirdPartyForm.get('invoice_no')?.setValue('');
    this.thirdPartyForm.get('bill_no')?.setValue('');
    this.thirdPartyForm.get('c_balance')?.setValue('');
    this.thirdPartyForm.get('credit_days')?.setValue('');
    this.thirdPartyForm.get('total')?.setValue('');
    this.thirdPartyForm.get('cuid')?.setValue(this.userID);
    this.thirdPartyForm.get('companyid')?.setValue(this.companyID);

    this.addNesForm();
    this.getThirdPartyList();
    this.findBillNo();
    this.findSiCode();
    this.findRefCode();
    this.getThirdPartPurchaseList(this.today);
  }

  deleteFun(id: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.tPGSTPSvc.delete(id).subscribe((res) => {
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
