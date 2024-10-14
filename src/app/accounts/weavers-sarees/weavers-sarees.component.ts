import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { thirdPartyPurchaseService } from 'src/app/api-service/Accounts/thirdPartyPurchase.service';
import { weaverSareesService } from 'src/app/api-service/Accounts/weaverSarees.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { brandMasterService } from 'src/app/api-service/brandMaster.service';
import { financialYearService } from 'src/app/api-service/financialYear.service';
import { itemMasterService } from 'src/app/api-service/itemMaster.service';
import { weaverMasterService } from 'src/app/api-service/weaverMaster.service';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-weavers-sarees',
  templateUrl: './weavers-sarees.component.html',
  styleUrl: './weavers-sarees.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeaversSareesComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  weaverDetailsList: any[] = [];
  suggestions: any[] = [];
  brandList: any[] = [];
  itemMasterList: any[] = [];
  newItemList: any[] = [];
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
  }

  constructor(
    private router: Router,
    private notificationSvc: NotificationsService,
    private DialogSvc: DialogService,
    private wMSvc: weaverMasterService,
    private cdRef: ChangeDetectorRef,
    private bSvc: brandMasterService,
    private ITMSRC: itemMasterService,
    private WRSSVC: weaverSareesService,
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
  colculation() {
    this.findSiCode();
    this.findRefCode();
  }

  weaverSareesForm = new FormGroup({
    purchaseid: new FormControl(0),
    weaverid: new FormControl(null),
    date: new FormControl(''),
    weaver_nested: new FormArray([
      new FormGroup({
        purchase_n_id: new FormControl(0),
        si_code: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
        ref_code: new FormControl(''),
        brandid: new FormControl(null),
        itemid: new FormControl(null),
        qty: new FormControl('1'),
      }),
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
    this.WRSSVC.getWeaverSareesList(this.companyID, dated).subscribe(
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
    return (this.weaverSareesForm.get('weaver_nested') as FormArray).controls;
  }

  getBrandControl(index: number): FormControl {
    const control = (this.weaverSareesForm.get('weaver_nested') as FormArray).at(index)?.get('brandid') as FormControl;
    return control;
  }

  isBrandControlInvalid(index: number): boolean {
    const control = this.getBrandControl(index);
    return control.touched && !!control.errors;
  }

  getItemControl(index: number): FormControl {
    const control = (this.weaverSareesForm.get('weaver_nested') as FormArray)
      .at(index)
      ?.get('itemid') as FormControl;
    return control;
  }

  isItemControlInvalid(index: number): boolean {
    const control = this.getItemControl(index);
    return control.touched && !!control.errors;
  }

  getSiControl(index: number): FormControl {
    const control = (this.weaverSareesForm.get('weaver_nested') as FormArray)
      .at(index)
      ?.get('si_code') as FormControl;
    return control;
  }

  isSiControlInvalid(index: number): boolean {
    const control = this.getSiControl(index);
    return control.touched && !!control.errors;
  }

  addNesForm() {
    const newControl = new FormGroup({
      purchase_n_id: new FormControl(0),
      si_code: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      ref_code: new FormControl(''),
      brandid: new FormControl(null),
      itemid: new FormControl(null),
      qty: new FormControl('1'),
    });
    (this.weaverSareesForm.get('weaver_nested') as FormArray).push(newControl);
    this.colculation();
    this.someMethod(); // Trigger change detection
  }

  removeNesForm(index: number) {
    (this.weaverSareesForm.get('weaver_nested') as FormArray).removeAt(index);
    this.colculation();
    this.someMethod(); // Trigger change detection
  }

  async getItemchange(i: any): Promise<void> {

    const Control = this.weaverSareesForm.get('weaver_nested') as FormArray;
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
    this.WRSSVC.getWeaverRefCode(
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

        this.WRSSVC.addNew(value).subscribe((res) => {
          if (res.status == 'Saved successfully') {
            this.notificationSvc.success('Saved Success');
            this.cancelClick();
          } else {
            this.notificationSvc.error('Something error');
          }
        });
      }
    } else {
      this.weaverSareesForm.markAllAsTouched();
      this.notificationSvc.error('Some required input are missing!');
    }
  }

  async update(item: any) {
    const nestedArray = await this.WRSSVC.getWeaverSareesNestedList(
      item.purchaseid
    ).toPromise();
    const control = <FormArray>this.weaverSareesForm.controls['weaver_nested'];
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.weaverSareesForm.patchValue(item);
      this.shortCode = item.short_code;
      this.weaverSareesForm.get('cuid')?.setValue(this.userID);

      nestedArray?.forEach(async (e, i) => {
        const filteredItems = this.itemMasterList.filter((ee) => {
          return ee.brandid == e.brandid;
        });

        if (filteredItems && filteredItems.length > 0) {
          this.newItemList[e.brandid] = filteredItems;
        }

        const newControl = new FormGroup({
          purchase_n_id: new FormControl(e.purchase_n_id),
          si_code: new FormControl(e.si_code, [Validators.required, Validators.pattern('^[0-9]*$')]),
          ref_code: new FormControl(e.ref_code),
          brandid: new FormControl(e.brandid),
          itemid: new FormControl(e.itemid),
          qty: new FormControl(e.qty, [
            Validators.required,
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
          ]),
        });
        (this.weaverSareesForm.get('weaver_nested') as FormArray).push(
          newControl
        );
        this.someMethod();
      });
    }

    this.scrollToTableTop();
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  cancelClick() {
    this.weaverSareesForm.reset();
    const control = <FormArray>this.weaverSareesForm.controls['weaver_nested'];
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.weaverSareesForm.get('purchaseid')?.setValue(0);
    this.weaverSareesForm.get('weaverid')?.setValue(null);
    this.weaverSareesForm.get('date')?.setValue('');
    this.weaverSareesForm.get('cuid')?.setValue(this.userID);
    this.weaverSareesForm.get('companyid')?.setValue(this.companyID);

    this.addNesForm();
    this.getWeaverList();
    this.getWeaverSareesList(this.today);
    this.findSiCode();
    this.findRefCode();
  }

  deleteFun(id: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.WRSSVC.delete(id).subscribe((res) => {
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
