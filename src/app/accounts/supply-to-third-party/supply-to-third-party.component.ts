import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { supplyThirdPartyService } from 'src/app/api-service/Accounts/supplyThirdParty.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { linkProductMasterService } from 'src/app/api-service/linkProduct.service';
import { nestedProductMasterService } from 'src/app/api-service/nestedProductMaster.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';
import { unitMasterService } from 'src/app/api-service/unitMaster.service';

@Component({
  selector: 'app-supply-to-third-party',
  templateUrl: './supply-to-third-party.component.html',
  styleUrl: './supply-to-third-party.component.scss'
})
export class SupplyToThirdPartyComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  suggestions: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  rawProductList: any[] = [];
  NestedProductList: any[] = [];
  unitMasterList: any[] = [];
  thirdPartyDetailsList: any[] = [];
  linkProductList: any[] = [];

  async ngOnInit() {
    this.getThirdPartyList();
    this.getNProductList();
    this.getLinkProductList();
    this.findBillNo();
    this.getUnitMasterDetails();
    this.getRawMAtrialList(this.today);
  }

  constructor(
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private tHMSVC: thirdPartyMasterService,
    private stPSvc: supplyThirdPartyService,
    private nPSvc: nestedProductMasterService,
    private UNITMSVC: unitMasterService,
    private lPSvc: linkProductMasterService
  ) { }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }
  getLinkProductList() {
    this.lPSvc.getList(this.companyID).subscribe((res) => {
      this.linkProductList = res
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

  getUnitMasterDetails() {
    this.UNITMSVC.getUnitsList(this.companyID).subscribe((res) => {
      this.unitMasterList = res;
    });
  }

  getNProductList() {
    this.nPSvc.getList(this.companyID).subscribe((res) => {
      this.NestedProductList = res
    })
  }

  getRawMAtrialList(dated: any) {
    this.stPSvc.getRawProductLists(this.companyID, dated).subscribe((res: any) => {
      this.rawProductList = res;
      this.cdRef.detectChanges();
    });
  }

  someMethod() {
    this.cdRef.detectChanges();
  }

  async findBillNo(): Promise<void> {
    this.stPSvc.getMaxId(this.companyID).subscribe((data) => {
      let maxnumber = 0;
      if (data.length > 0) {
        maxnumber = data[0].supplyid + 1;
        if (maxnumber < 10) {
          this.supplyForm.get('bill_no')?.setValue('0' + String(maxnumber));
        }
        else {
          this.supplyForm.get('bill_no')?.setValue(String(maxnumber));
        }
      }
    });
  }

  supplyForm = new FormGroup({
    supplyid: new FormControl(0),
    third_partyid: new FormControl(null),
    date: new FormControl(''),
    bill_no: new FormControl(''),
    productid: new FormControl(null),
    qty: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
    supply_nested: new FormArray([]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (this.supplyForm.get('supply_nested') as FormArray).controls;
  }

  getProductControl(index: number): FormControl {
    const control = (
      this.supplyForm.get('supply_nested') as FormArray
    )
      .at(index)?.get('n_productid') as FormControl;
    return control;
  }

  isProductControlInvalid(index: number): boolean {
    const control = this.getProductControl(index);
    return control.touched && !!control.errors;
  }

  getAqtyControl(index: number): FormControl {
    const control = (
      this.supplyForm.get('supply_nested') as FormArray
    )
      .at(index)?.get('a_qty') as FormControl;
    return control;
  }

  isAtytrolInvalid(index: number): boolean {
    const control = this.getAqtyControl(index);
    return control.touched && !!control.errors;
  }

  getQtyControl(index: number): FormControl {
    const control = (
      this.supplyForm.get('supply_nested') as FormArray
    )
      .at(index)?.get('qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }

  async getNested() {
    debugger
    const id = this.supplyForm.value.productid;
    const linkID = this.linkProductList.find((e) => { return e.productid === id });
    const nestedList = await this.lPSvc.getNestedList(linkID.linkid).toPromise();
    const control = <FormArray><unknown>this.supplyForm.controls['supply_nested'];
    while (control.length !== 0) {
      control.removeAt(0);
    }

    if (control.length == 0) {
      nestedList?.forEach(async (e, i) => {
        const newGSTDet = this.NestedProductList.find((ee) => { return ee.n_productid == e.n_productid });
        debugger
        const newControl = new FormGroup({
          supply_n_id: new FormControl(0),
          n_productid: new FormControl(e.n_productid),
          unit_name: new FormControl(newGSTDet.unit_name),
          a_qty: new FormControl(String(Number(e.a_qty) * Number(this.supplyForm.value.qty)), [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
          qty: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)])
        });
        (this.supplyForm.get('supply_nested') as FormArray).push(newControl);
        this.someMethod();
      });
    }
  }

  async save() {
    if (this.supplyForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed().toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.supplyForm.value;
        debugger
        this.stPSvc.addNew(value).subscribe((res) => {
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
      this.supplyForm.markAllAsTouched();
    }
  }

  async update(item: any) {
    const nestedArray = await this.stPSvc.getRawProductNestedLists(item.supplyid).toPromise();

    const control = <FormArray><unknown>(this.supplyForm.controls['supply_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.supplyForm.patchValue(item);
      this.supplyForm.get('cuid')?.setValue(this.userID);

      nestedArray?.forEach(async (e, i) => {
        const newGSTDet = this.NestedProductList.find((ee) => { return ee.n_productid == e.n_productid });
        const newControl = new FormGroup({
          supply_n_id: new FormControl(e.supply_n_id),
          n_productid: new FormControl(e.n_productid),
          unit_name: new FormControl(newGSTDet.unit_name),
          a_qty: new FormControl(e.a_qty, [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)]),
          qty: new FormControl(e.qty, [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)])
        });
        (this.supplyForm.get('supply_nested') as FormArray).push(newControl);
        this.someMethod();
      });
    }

    this.scrollToTableTop();
  }

  cancelClick() {
    this.supplyForm.reset();
    const control = <FormArray><unknown>(this.supplyForm.controls['supply_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.supplyForm.get('supplyid')?.setValue(0);
    this.supplyForm.get('third_partyid')?.setValue(null);
    this.supplyForm.get('date')?.setValue('');
    this.supplyForm.get('bill_no')?.setValue('');
    this.supplyForm.get('cuid')?.setValue(this.userID);
    this.supplyForm.get('companyid')?.setValue(this.companyID);

    this.getThirdPartyList();
    this.findBillNo();
    this.getNProductList();
    this.getRawMAtrialList(this.today);
  }

  deleteFun(id: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.stPSvc.delete(id).subscribe((res) => {
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
