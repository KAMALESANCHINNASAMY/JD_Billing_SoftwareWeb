import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { thirdPartyPurchaseService } from 'src/app/api-service/Accounts/thirdPartyPurchase.service';
import { weaverGivenReceivedService } from 'src/app/api-service/Accounts/weaversGivenReceived.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { brandMasterService } from 'src/app/api-service/brandMaster.service';
import { financialYearService } from 'src/app/api-service/financialYear.service';
import { itemMasterService } from 'src/app/api-service/itemMaster.service';
import { weaverMasterService } from 'src/app/api-service/weaverMaster.service';

@Component({
  selector: 'app-weavers-with-given-received',
  standalone: false,
  templateUrl: './weavers-with-given-received.component.html',
  styleUrl: './weavers-with-given-received.component.scss'
})
export class WeaversWithGivenReceivedComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  weaverDetailsList: any[] = [];
  suggestions: any[] = [];
  brandList: any[] = [];
  itemMasterList: any[] = [];
  newItemList: any[] = [];
  newItemListN: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  weaverSareesList: any[] = [];
  shortCode: string = '';
  ActiveFinYr: any[] = [];

  aFfromdate: string = String(localStorage.getItem('fromdate'));
  aFtodate: string = String(localStorage.getItem('todate'));

  async ngOnInit() {
    await this.getActiveFinYr();
    this.getWeaverList();
    this.getBrandList();
    this.getItemMasterDetails();
    this.getCommonControls();
    this.getWeaverSareesList(this.today);
    this.findSiCode();
    this.findRefCode();

    this.changeMode();
  }

  constructor(
    private router: Router,
    private notificationSvc: NotificationsService,
    private DialogSvc: DialogService,
    private wMSvc: weaverMasterService,
    private cdRef: ChangeDetectorRef,
    private bSvc: brandMasterService,
    private ITMSRC: itemMasterService,
    private wGRSvc: weaverGivenReceivedService,
    private tPPSvc: thirdPartyPurchaseService,
    private FINYRSVC: financialYearService
  ) { }

  isDateInRange(today: string, fromdate: string, todate: string): boolean {
    const todayDate = new Date(today);
    const fromDate = new Date(fromdate);
    const toDate = new Date(todate);

    // Check if today is not between fromdate and todate
    return !(todayDate >= fromDate && todayDate <= toDate);
  }

  setWeaverDetails(id: any) {
    this.weaverSareesForm.get('weaverid')?.setValue(id);
    const newArray = this.weaverDetailsList.filter((e) => {
      return e.weaverid == id;
    });
    if (newArray.length > 0) {
      this.shortCode = newArray[0].short_code;
      this.colculation();

      this.someMethod(); // Trigger change detection
    }
  }

  async getActiveFinYr() {
    this.FINYRSVC.getActiveFinYear(this.companyID).subscribe((res: any) => {
      this.ActiveFinYr = res;
    });
  }
  async changeMode() {
    const control = <FormArray>this.weaverSareesForm.controls['giventoweavers'];
    while (control.length !== 0) {
      control.removeAt(0);
    }

    const controlNested = <FormArray><unknown>this.weaverSareesForm.controls['weaver_nested'];
    while (controlNested.length !== 0) {
      controlNested.removeAt(0);
    }
    if (this.weaverSareesForm.value.mode == 'Given') {
      await this.addNesForm();
    }
    else if (this.weaverSareesForm.value.mode == 'Received') {
      await this.addNesFormN();
    }
    this.colculation();
  }
  async colculation() {
    this.findSiCode();
    this.findRefCode();
  }

  mathsCalculation() {
    const controlNested = <FormArray><unknown>this.weaverSareesForm.controls['giventoweavers'];

    controlNested.value.forEach((e: any, i: number) => {
      const gram = Number(controlNested.at(i).get('g_gram')?.value);
      const rate = Number(controlNested.at(i).get('g_rate')?.value);

      controlNested.at(i).get('g_total')?.setValue(String((gram * rate).toFixed(2)));
    });
  }

  weaverSareesForm = new FormGroup({
    purchaseid: new FormControl(0),
    weaverid: new FormControl(null),
    mode: new FormControl('Given'),
    date: new FormControl(''),
    giventoweavers: new FormArray([
      new FormGroup({
        givenid: new FormControl(0),
        brandid: new FormControl(null),
        itemid: new FormControl(null),
        description: new FormControl(''),
        g_gram: new FormControl('', [Validators.required]),
        g_rate: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)]),
        g_total: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)]),
        g_advance: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)])
      }),
    ]),
    weaver_nested: new FormArray([
      new FormGroup({
        purchase_n_id: new FormControl(0),
        si_code: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
        ref_code: new FormControl(''),
        brandid: new FormControl(null),
        itemid: new FormControl(null),
        description: new FormControl(''),
        qty: new FormControl('1', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/),]),
        r_gram: new FormControl('', [Validators.required]),
        r_advance: new FormControl('', [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)])
      })
    ]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

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

  getWeaverList() {
    this.weaverDetailsList = [];
    this.suggestions = [];
    this.wMSvc.getList(this.companyID).subscribe((res: any) => {
      this.weaverDetailsList = res;
      this.suggestions = res;
    });
  }

  getWeaverSareesList(dated: any) {
    this.wGRSvc.getBoth(this.companyID, dated).subscribe(
      (res: any) => {
        this.weaverSareesList = res;
        this.cdRef.detectChanges();
      }
    );
  }

  suggest(value: any) {
    this.suggestions = this.weaverDetailsList.filter((item) =>
      item.weaver_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1) this.suggestions = this.weaverDetailsList;
  }

  someMethod() {
    this.cdRef.detectChanges();
  }

  getCommonControls(): AbstractControl[] {
    return (this.weaverSareesForm.get('giventoweavers') as FormArray).controls;
  }
  getweaverNestedControls(): AbstractControl[] {
    return (this.weaverSareesForm.get('weaver_nested') as FormArray).controls;
  }

  getBrandControl(index: number): FormControl {
    const control = (this.weaverSareesForm.get('giventoweavers') as FormArray).at(index)?.get('brandid') as FormControl;
    return control;
  }

  isBrandControlInvalid(index: number): boolean {
    const control = this.getBrandControl(index);
    return control.touched && !!control.errors;
  }

  getBrandControlN(index: number): FormControl {
    const control = (this.weaverSareesForm.get('weaver_nested') as FormArray).at(index)?.get('brandid') as FormControl;
    return control;
  }

  isBrandControlInvalidN(index: number): boolean {
    const control = this.getBrandControlN(index);
    return control.touched && !!control.errors;
  }

  getItemControl(index: number): FormControl {
    const control = (this.weaverSareesForm.get('giventoweavers') as FormArray).at(index)?.get('itemid') as FormControl;
    return control;
  }

  isItemControlInvalid(index: number): boolean {
    const control = this.getItemControl(index);
    return control.touched && !!control.errors;
  }

  getItemControlN(index: number): FormControl {
    const control = (this.weaverSareesForm.get('weaver_nested') as FormArray).at(index)?.get('itemid') as FormControl;
    return control;
  }

  isItemControlInvalidN(index: number): boolean {
    const control = this.getItemControlN(index);
    return control.touched && !!control.errors;
  }

  getSiControlN(index: number): FormControl {
    const control = (this.weaverSareesForm.get('weaver_nested') as FormArray).at(index)?.get('si_code') as FormControl;
    return control;
  }

  isSiControlInvalidN(index: number): boolean {
    const control = this.getSiControlN(index);
    return control.touched && !!control.errors;
  }

  getGgramControl(index: number): FormControl {
    const control = (this.weaverSareesForm.get('giventoweavers') as FormArray).at(index)?.get('g_gram') as FormControl;
    return control;
  }

  isGgramControlInvalid(index: number): boolean {
    const control = this.getGgramControl(index);
    return control.touched && !!control.errors;
  }

  getGrateControl(index: number): FormControl {
    const control = (this.weaverSareesForm.get('giventoweavers') as FormArray).at(index)?.get('g_rate') as FormControl;
    return control;
  }

  isGrateControlInvalid(index: number): boolean {
    const control = this.getGrateControl(index);
    return control.touched && !!control.errors;
  }

  getGtotalControl(index: number): FormControl {
    const control = (this.weaverSareesForm.get('giventoweavers') as FormArray).at(index)?.get('g_total') as FormControl;
    return control;
  }

  isGtotalControlInvalid(index: number): boolean {
    const control = this.getGtotalControl(index);
    return control.touched && !!control.errors;
  }

  getGadvanceControl(index: number): FormControl {
    const control = (this.weaverSareesForm.get('giventoweavers') as FormArray).at(index)?.get('g_advance') as FormControl;
    return control;
  }

  isGadvanceControlInvalid(index: number): boolean {
    const control = this.getGadvanceControl(index);
    return control.touched && !!control.errors;
  }

  getRgramControlN(index: number): FormControl {
    const control = (this.weaverSareesForm.get('weaver_nested') as FormArray).at(index)?.get('r_gram') as FormControl;
    return control;
  }

  isRgramControlInvalidN(index: number): boolean {
    const control = this.getRgramControlN(index);
    return control.touched && !!control.errors;
  }

  getRadvanceControlN(index: number): FormControl {
    const control = (this.weaverSareesForm.get('weaver_nested') as FormArray).at(index)?.get('r_advance') as FormControl;
    return control;
  }

  isRadvanceControlInvalidN(index: number): boolean {
    const control = this.getRadvanceControlN(index);
    return control.touched && !!control.errors;
  }

  async addNesForm() {
    const newControl = new FormGroup({
      givenid: new FormControl(0),
      brandid: new FormControl(null),
      itemid: new FormControl(null),
      description: new FormControl(''),
      g_gram: new FormControl('', [Validators.required]),
      g_rate: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)]),
      g_total: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)]),
      g_advance: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)])
    });
    (this.weaverSareesForm.get('giventoweavers') as FormArray).push(newControl);
    this.someMethod();
  }

  removeNesForm(index: number) {
    (this.weaverSareesForm.get('giventoweavers') as FormArray).removeAt(index);
    this.someMethod();
  }

  async addNesFormN() {
    const newControl = new FormGroup({
      purchase_n_id: new FormControl(0),
      si_code: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      ref_code: new FormControl(''),
      brandid: new FormControl(null),
      itemid: new FormControl(null),
      description: new FormControl(''),
      qty: new FormControl('1', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/),]),
      r_gram: new FormControl('', [Validators.required]),
      r_advance: new FormControl('', [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)])
    });
    (this.weaverSareesForm.get('weaver_nested') as FormArray).push(newControl);
    this.colculation();
    this.someMethod();
  }

  removeNesFormN(index: number) {
    (this.weaverSareesForm.get('weaver_nested') as FormArray).removeAt(index);
    this.colculation();
    this.someMethod();
  }

  async getItemchange(i: any): Promise<void> {
    const Control = this.weaverSareesForm.get('giventoweavers') as FormArray;
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
  }

  async getItemchangeN(i: any): Promise<void> {
    const Control = this.weaverSareesForm.get('weaver_nested') as FormArray;
    const brandid = Control.at(i).get('brandid')?.value;

    // Filter itemMasterList based on selected brandid
    const filteredItems = this.itemMasterList.filter(
      (e) => e.brandid === brandid
    );

    // Assign filtered list to newItemList for the corresponding index
    if (filteredItems && filteredItems.length > 0) {
      this.newItemListN[brandid] = filteredItems;
    } else {
      this.newItemListN[brandid] = []; // Set empty array if no matching items found
    }
    Control.at(i).get('itemid')?.setValue(null);
  }

  async findSiCode(): Promise<void> {
    this.tPPSvc.getThirdPartySICode(this.companyID).subscribe((data) => {
      let maxnumber = 0;
      if (data.length > 0) {
        const Control = this.weaverSareesForm.get('weaver_nested') as FormArray;
        const newAlredyUpCount = Control.value.filter((eu: any) => {
          return eu.purchase_n_id > 0;
        });
        Control.value.forEach((element: any, i: number) => {
          if (Number(Control.at(i).get('purchase_n_id')?.value) == 0) {
            maxnumber = data[0].purchaseid + 1;
            if (maxnumber < 10 && (maxnumber + i - newAlredyUpCount.length) < 10) {
              Control.at(i).get('si_code')?.setValue('0' + String(maxnumber + i - newAlredyUpCount.length));
            } else {
              Control.at(i).get('si_code')?.setValue(String(maxnumber + i - newAlredyUpCount.length));
            }
          }
        });
      }
    });
  }

  async findRefCode(): Promise<void> {
    this.wGRSvc.getWeaverRefCode(
      this.companyID,
      this.weaverSareesForm.value.weaverid || 0
    ).subscribe((data) => {
      let maxnumber = 0;
      if (data.length > 0) {
        const Control = this.weaverSareesForm.get('weaver_nested') as FormArray;
        const newAlredyUpCount = Control.value.filter((eu: any) => {
          return eu.purchase_n_id > 0;
        });
        Control.value.forEach((element: any, i: number) => {
          if (Number(Control.at(i).get('purchase_n_id')?.value) == 0) {
            maxnumber = data[0].weaverid + 1;
            Control.at(i).get('ref_code')?.setValue(this.shortCode + String(maxnumber + i - newAlredyUpCount.length));
          }
        });
      }
    });
  }

  async save() {
    if (this.weaverSareesForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        var value = this.weaverSareesForm.value;
        if (this.weaverSareesForm.value.mode == 'Given') {
          this.wGRSvc.addNewGiven(value).subscribe((res) => {
            if (res.status == 'Saved successfully') {
              this.notificationSvc.success('Saved Success');
              this.cancelClick();
            } else {
              this.notificationSvc.error('Something error');
            }
          });
        }
        else if (this.weaverSareesForm.value.mode == 'Received') {
          this.wGRSvc.addNewReceived(value).subscribe((res) => {
            if (res.status == 'Saved successfully') {
              this.notificationSvc.success('Saved Success');
              this.cancelClick();
            } else {
              this.notificationSvc.error('Something error');
            }
          });
        }
      }
    } else {
      this.weaverSareesForm.markAllAsTouched();
      this.notificationSvc.error('Some required input are missing!');
    }
  }

  async update(item: any) {
    const GivenList = await this.wGRSvc.getGiventoweavers(item.purchaseid).toPromise() || [];
    const ReceivedList = await this.wGRSvc.getReceivedtoweavers(item.purchaseid).toPromise() || [];

    const control = <FormArray>this.weaverSareesForm.controls['giventoweavers'];
    while (control.length !== 0) {
      control.removeAt(0);
    }

    const controlNested = <FormArray><unknown>this.weaverSareesForm.controls['weaver_nested'];
    while (controlNested.length !== 0) {
      controlNested.removeAt(0);
    }

    if (control.length == 0 && controlNested.length == 0) {
      this.weaverSareesForm.patchValue(item);
      this.shortCode = item.short_code;
      this.weaverSareesForm.get('cuid')?.setValue(this.userID);

      if (item.mode == 'Given') {
        GivenList?.forEach(async (e) => {
          const filteredItems = this.itemMasterList.filter((ee) => {
            return ee.brandid == e.brandid;
          });
          if (filteredItems && filteredItems.length > 0) {
            this.newItemList[e.brandid] = filteredItems;
          }

          const newControl = new FormGroup({
            givenid: new FormControl(e.givenid),
            brandid: new FormControl(e.brandid),
            itemid: new FormControl(e.itemid),
            description: new FormControl(e.description),
            g_gram: new FormControl(e.g_gram, [Validators.required]),
            g_rate: new FormControl(e.g_rate, [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)]),
            g_total: new FormControl(e.g_total, [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)]),
            g_advance: new FormControl(e.g_advance, [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)])
          });
          (this.weaverSareesForm.get('giventoweavers') as FormArray).push(
            newControl
          );
          this.someMethod();
        });
      }
      else if (item.mode == 'Received') {
        ReceivedList?.forEach(async (e) => {
          const filteredItems = this.itemMasterList.filter((ee) => {
            return ee.brandid == e.brandid;
          });
          if (filteredItems && filteredItems.length > 0) {
            this.newItemListN[e.brandid] = filteredItems;
          }

          const newControl = new FormGroup({
            purchase_n_id: new FormControl(e.purchase_n_id),
            si_code: new FormControl(e.si_code, [Validators.required, Validators.pattern('^[0-9]*$')]),
            ref_code: new FormControl(e.ref_code),
            brandid: new FormControl(e.brandid),
            itemid: new FormControl(e.itemid),
            description: new FormControl(e.description),
            qty: new FormControl(e.qty, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/),]),
            r_gram: new FormControl(e.r_gram, [Validators.required]),
            r_advance: new FormControl(e.r_advance, [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)]),
          });
          (this.weaverSareesForm.get('weaver_nested') as FormArray).push(
            newControl
          );
          this.someMethod();
        });
      }
    }
    this.colculation();
    this.scrollToTableTop();
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  cancelClick() {
    this.weaverSareesForm.reset();
    const control = <FormArray>this.weaverSareesForm.controls['giventoweavers'];
    while (control.length !== 0) {
      control.removeAt(0);
    }

    const controlNested = <FormArray><unknown>this.weaverSareesForm.controls['weaver_nested'];
    while (controlNested.length !== 0) {
      controlNested.removeAt(0);
    }

    this.weaverSareesForm.get('purchaseid')?.setValue(0);
    this.weaverSareesForm.get('weaverid')?.setValue(null);
    this.weaverSareesForm.get('date')?.setValue('');
    this.weaverSareesForm.get('cuid')?.setValue(this.userID);
    this.weaverSareesForm.get('mode')?.setValue('Given');
    this.weaverSareesForm.get('companyid')?.setValue(this.companyID);

    this.changeMode();
    this.getWeaverList();
    this.getWeaverSareesList(this.today);
    this.findSiCode();
    this.findRefCode();
  }

  deleteFun(item: any) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true && item.mode == 'Received') {
          this.wGRSvc.delete(item.purchaseid).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
        else if (res == true && item.mode == 'Given') {
          this.wGRSvc.deleteGiven(item.purchaseid).subscribe((res) => {
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

  setTwoDigitGrate(i: number) {
    const Control = this.weaverSareesForm.get('giventoweavers') as FormArray;
    const adControl = Control.at(i).get('g_rate');
    let value: string | number = adControl?.value || 0;
    // Ensure value is treated as string for parseFloat
    if (!isNaN(Number(value)) && value !== null && value !== '') {
      value = parseFloat(value.toString()).toFixed(2).toString();
      Control.at(i).get('g_rate')?.setValue(value, { emitEvent: false });
    }
  }

  setTwoDigitGtotal(i: number) {
    const Control = this.weaverSareesForm.get('giventoweavers') as FormArray;
    const adControl = Control.at(i).get('g_total');
    let value: string | number = adControl?.value || 0;
    // Ensure value is treated as string for parseFloat
    if (!isNaN(Number(value)) && value !== null && value !== '') {
      value = parseFloat(value.toString()).toFixed(2).toString();
      Control.at(i).get('g_total')?.setValue(value, { emitEvent: false });
    }
  }

  setTwoDigitGadvance(i: number) {
    const Control = this.weaverSareesForm.get('giventoweavers') as FormArray;
    const adControl = Control.at(i).get('g_advance');
    let value: string | number = adControl?.value || 0;
    // Ensure value is treated as string for parseFloat
    if (!isNaN(Number(value)) && value !== null && value !== '') {
      value = parseFloat(value.toString()).toFixed(2).toString();
      Control.at(i).get('g_advance')?.setValue(value, { emitEvent: false });
    }
  }

  setTwoDigitRadvanceN(i: number) {
    const Control = this.weaverSareesForm.get('weaver_nested') as FormArray;
    const adControl = Control.at(i).get('r_advance');
    let value: string | number = adControl?.value || 0;
    // Ensure value is treated as string for parseFloat
    if (!isNaN(Number(value)) && value !== null && value !== '') {
      value = parseFloat(value.toString()).toFixed(2).toString();
      Control.at(i).get('r_advance')?.setValue(value, { emitEvent: false });
    }
  }
}
