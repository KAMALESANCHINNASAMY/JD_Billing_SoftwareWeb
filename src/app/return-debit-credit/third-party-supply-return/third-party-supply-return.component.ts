import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { supplyThirdPartyService } from 'src/app/api-service/Accounts/supplyThirdParty.service';
import { thirdPartySupplyReturnService } from 'src/app/api-service/Credit-Debit-note/thirdPartySupplyReturn.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { nestedProductMasterService } from 'src/app/api-service/nestedProductMaster.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';

@Component({
  selector: 'app-third-party-supply-return',
  templateUrl: './third-party-supply-return.component.html',
  styleUrl: './third-party-supply-return.component.scss'
})
export class ThirdPartySupplyReturnComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  suggestions: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  supplyList: any[] = [];
  supplierDebitList: any[] = [];
  NestedProductList: any[] = [];

  constructor(
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private router: Router,
    private tHMSVC: thirdPartyMasterService,
    private cdRef: ChangeDetectorRef,
    private rrPSvc: thirdPartySupplyReturnService,
    private rpPSvc: supplyThirdPartyService,
    private nPSvc: nestedProductMasterService
  ) { }
  ngOnInit() {
    this.getThirdPartyList();
    this.getReturn(this.today);
    this.findBillNo();
    this.getNProductList();
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

  getNProductList() {
    this.nPSvc.getList(this.companyID).subscribe((res) => {
      this.NestedProductList = res
    })
  }

  getReturn(dated: any) {
    this.rrPSvc.get(this.companyID, dated).subscribe((res: any) => {
      this.supplierDebitList = res;
      this.cdRef.detectChanges();
    });
  }

  async setSupplierDetails(id: any) {
    this.retSupplyForm.get('supplyid')?.setValue(null);
    this.supplyList = []
    this.rrPSvc.getSupplyList(this.companyID, id).subscribe((res) => {
      this.supplyList = res;
    });
    this.someMethod();
  }

  async findBillNo(): Promise<void> {
    const data: any = await this.rrPSvc.getMaxId(this.companyID).toPromise();
    let maxnumber = 0;
    if (Number(data.length) > 0 && this.retSupplyForm.value.returnid == 0) {
      maxnumber = data[0].returnid + 1;
      if (maxnumber < 10) {
        this.retSupplyForm.get('return_no')?.setValue('0' + String(maxnumber));
      } else {
        this.retSupplyForm.get('return_no')?.setValue(String(maxnumber));
      }
    }
  }

  async onBillNoSelected(value: any) {
    const nestedArray = await this.rpPSvc.getRawProductNestedLists(value.supplyid).toPromise();
    const control = <FormArray><unknown>(this.retSupplyForm.controls['supply_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0 && nestedArray?.length != 0) {
      this.retSupplyForm.get('bill_no')?.setValue(value.bill_no);
      nestedArray?.forEach(async (e, i) => {
        const newControl = new FormGroup({
          return_n_id: new FormControl(0),
          supply_n_id: new FormControl(e.supply_n_id),
          n_productid: new FormControl(e.n_productid),
          a_qty: new FormControl(e.a_qty),
          ret_a_qty: new FormControl(e.ret_a_qty),
          qty: new FormControl(e.qty),
          ret_qty: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)])
        });
        (this.retSupplyForm.get('supply_nested') as FormArray).push(
          newControl
        );
        this.someMethod();
      });
    }
  }

  someMethod() {
    this.cdRef.detectChanges();
  }
  retSupplyForm = new FormGroup({
    returnid: new FormControl(0),
    supplyid: new FormControl(null),
    third_partyid: new FormControl(null),
    bill_no: new FormControl('', [Validators.required]),
    return_no: new FormControl(''),
    return_date: new FormControl(''),
    supply_nested: new FormArray([]),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
  });

  getCommonControls(): AbstractControl[] {
    return (this.retSupplyForm.get('supply_nested') as FormArray).controls;
  }

  getQtyControl(index: number): FormControl {
    const control = (this.retSupplyForm.get('supply_nested') as FormArray).at(index)?.get('ret_qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }

  getaQtyControl(index: number): FormControl {
    const control = (this.retSupplyForm.get('supply_nested') as FormArray).at(index)?.get('ret_a_qty') as FormControl;
    return control;
  }

  isAQtyControlInvalid(index: number): boolean {
    const control = this.getaQtyControl(index);
    return control.touched && !!control.errors;
  }

  checkQty(i: any) {
    const Control = this.retSupplyForm.get('supply_nested') as FormArray;

    if (Number(Control.at(i).get('ret_a_qty')?.value) > Number(Control.at(i).get('a_qty')?.value)) {
      Control.at(i).get('ret_a_qty')?.setValue('');
      this.notificationSvc.error('Invaild Actual Qty');
    }

    if (Number(Control.at(i).get('ret_qty')?.value) > Number(Control.at(i).get('qty')?.value)) {
      Control.at(i).get('ret_qty')?.setValue('');
      this.notificationSvc.error('Invaild Qty')
    }
  }

  async save() {
    if (this.retSupplyForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.retSupplyForm.value;
        this.rrPSvc.addNew(value).subscribe((res) => {
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
      this.retSupplyForm.markAllAsTouched();
    }
  }

  async update(item: any) {
    await this.cancelClick();
    await this.setSupplierDetails(item.third_partyid)
    const nestedArray = await this.rrPSvc.getReturnNested(item.returnid).toPromise();

    const control = <FormArray><unknown>(this.retSupplyForm.controls['supply_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }

    if (control.length == 0) {
      this.retSupplyForm.patchValue(item);
      nestedArray?.forEach(async (e, i) => {
        const newControl = new FormGroup({
          return_n_id: new FormControl(0),
          supply_n_id: new FormControl(e.supply_n_id),
          n_productid: new FormControl(e.n_productid),
          a_qty: new FormControl(e.a_qty),
          ret_a_qty: new FormControl(e.ret_a_qty),
          qty: new FormControl(e.qty),
          ret_qty: new FormControl(e.ret_qty, [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)])
        });
        (this.retSupplyForm.get('supply_nested') as FormArray).push(
          newControl
        );
        this.someMethod();
      });
    }
  }

  async cancelClick() {
    this.retSupplyForm.reset();
    const control = <FormArray><unknown>(
      this.retSupplyForm.controls['supply_nested']
    );
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.retSupplyForm.get('returnid')?.setValue(0);
    this.retSupplyForm.get('third_partyid')?.setValue(null);
    this.retSupplyForm.get('return_date')?.setValue('');
    this.retSupplyForm.get('cuid')?.setValue(this.userID);
    this.retSupplyForm.get('companyid')?.setValue(this.companyID);
    this.findBillNo();
    this.getThirdPartyList();
    this.getReturn(this.today);
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }
}
