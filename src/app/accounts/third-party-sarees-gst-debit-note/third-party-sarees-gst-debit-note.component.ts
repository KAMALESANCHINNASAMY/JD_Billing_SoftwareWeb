import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { thirdPartyGSTPurchaseService } from 'src/app/api-service/Accounts/thirdPartyGstPurchase.service';
import { ThirdPartyPurchaseGstDebitService } from 'src/app/api-service/Credit-Debit-note/thirdPartyGstPurchaseDebit.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { brandMasterService } from 'src/app/api-service/brandMaster.service';
import { itemMasterService } from 'src/app/api-service/itemMaster.service';
import { ThirdPartyPurchasegstReturnReportService } from 'src/app/api-service/reports/thirdPartygstPurchaseReturnReport.service';
import { thirdPartyMasterService } from 'src/app/api-service/thirdPartyMaster.service';

@Component({
  selector: 'app-third-party-sarees-gst-debit-note',
  templateUrl: './third-party-sarees-gst-debit-note.component.html',
  styleUrl: './third-party-sarees-gst-debit-note.component.scss'
})
export class ThirdPartySareesGstDebitNoteComponent implements OnInit {

  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  thirdPartyDetailsList: any[] = [];
  suggestions: any[] = [];
  brandList: any[] = [];
  itemMasterList: any[] = [];
  newItemList: any[] = [];
  today: string = new Date().toISOString().slice(0, 10);
  ThirdPartyPurchaseGstDebitList: any[] = [];
  billNoList: any[] = [];
  billNoListsug: any[] = [];

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private tHMSVC: thirdPartyMasterService,
    private bSvc: brandMasterService,
    private ITMSRC: itemMasterService,
    private cdRef: ChangeDetectorRef,
    private TPPGSTDSVC: ThirdPartyPurchaseGstDebitService,
    private TPPGSTRR: ThirdPartyPurchasegstReturnReportService,
    private tPGSTPSvc: thirdPartyGSTPurchaseService
  ) { }

  ngOnInit() {
    this.getThirdPartyList();
    this.getBrandList();
    this.getItemMasterDetails();
    this.getThirdPartygstpurchaseDebitList(this.today);
    this.findBillNo();
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

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getThirdPartygstpurchaseDebitList(dated: any) {
    this.TPPGSTDSVC.getThirdPartyGstDebitList(this.companyID, dated).subscribe(
      (res: any) => {
        this.ThirdPartyPurchaseGstDebitList = res;
        this.cdRef.detectChanges();
      }
    );
  }

  getThirdPartyList() {
    this.tHMSVC.getList(this.companyID).subscribe((res) => {
      this.thirdPartyDetailsList = res;
      this.suggestions = res;
    });
  }
  suggest(value: any) {
    this.suggestions = this.thirdPartyDetailsList.filter((item) =>
      item.party_name.toLowerCase().includes(value.toLowerCase())
    );
    if (this.suggestions.length < 1)
      this.suggestions = this.thirdPartyDetailsList;
  }

  async setThirdPartyDetails(id: any) {
    this.billNoList = [];
    this.billNoListsug = [];
    this.thirdPartyGstDebitForm.get('purchaseid')?.setValue(null);
    const thirdpartBillNo = await this.TPPGSTDSVC.getBillNo(id, this.companyID).toPromise();
    this.billNoList = thirdpartBillNo || [];
    this.billNoListsug = thirdpartBillNo || [];
  }

  Billsugsuggest(value: any) {
    this.billNoListsug = this.billNoList.filter((item) =>
      item.bill_no.toLowerCase().includes(value.toLowerCase())
    );
    if (this.billNoListsug.length < 1)
      this.billNoListsug = this.billNoList;
  }

  async setNestedForm(value: number) {
    this.thirdPartyGstDebitForm.get('purchase_date')?.setValue('');
    this.thirdPartyGstDebitForm.get('total')?.setValue('');
    const nestedArray = await this.tPGSTPSvc.getThirdPartyPurchaseNestedLists(value).toPromise();

    const control = <FormArray><unknown>(this.thirdPartyGstDebitForm.controls['thirdPartyGst_Debit_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0 && nestedArray?.length != 0) {
      const formEle = this.billNoList.filter((e) => { return e.purchaseid == value });
      this.thirdPartyGstDebitForm.get('purchase_date')?.setValue(formEle[0].date);
      this.thirdPartyGstDebitForm.get('total')?.setValue(formEle[0].total);
      nestedArray?.forEach(async (e) => {
        const filteredItems = this.itemMasterList.filter(
          (ee) => ee.brandid == e.brandid
        );
        // Assign filtered list to newItemList for the corresponding index
        if (filteredItems && filteredItems.length > 0) {
          this.newItemList[e.brandid] = filteredItems;
        }
        const newControl = new FormGroup({
          thirdPartyDebit_n_id: new FormControl(0),
          purchase_n_id: new FormControl(e.purchase_n_id),
          purchaseid: new FormControl(e.purchaseid),
          ref_code: new FormControl(e.ref_code),
          si_code: new FormControl(e.si_code),
          brandid: new FormControl(e.brandid),
          itemid: new FormControl(e.itemid),
          hsn_number: new FormControl(e.hsn_number),
          gst_percentage: new FormControl(e.gst_percentage),
          price: new FormControl(e.price),
          discount: new FormControl(e.discount),
          qty: new FormControl(e.qty),
          return_qty: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
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
        (
          this.thirdPartyGstDebitForm.get(
            'thirdPartyGst_Debit_nested'
          ) as FormArray
        ).push(newControl);
        this.someMethod();
      });
    }
  }

  async findBillNo(): Promise<void> {
    const data: any = await this.TPPGSTDSVC.getMaxId(this.companyID).toPromise();
    let maxnumber = 0;
    if (data.length > 0 && this.thirdPartyGstDebitForm.value.thirdPartyDebitid == 0) {
      maxnumber = data[0].entryid + 1;
      if (maxnumber < 10) {
        this.thirdPartyGstDebitForm.get('return_no')?.setValue('0' + String(maxnumber));
      } else {
        this.thirdPartyGstDebitForm.get('return_no')?.setValue(String(maxnumber));
      }
    }
  }

  thirdPartyGstDebitForm = new FormGroup({
    thirdPartyDebitid: new FormControl(0),
    purchaseid: new FormControl(0),
    third_partyid: new FormControl(null),
    purchase_date: new FormControl(''),
    invoice_no: new FormControl(''),
    invoice_date: new FormControl(''),
    return_no: new FormControl(''),
    return_date: new FormControl(''),
    return_total: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
    ]),
    total: new FormControl(''),
    thirdPartyGst_Debit_nested: new FormArray([
      // new FormGroup({
      //   thirdPartyDebit_n_id: new FormControl(0),
      //   purchase_n_id: new FormControl(0),
      //   purchaseid: new FormControl(0),
      //   thirdPartyDebitid: new FormControl(0),
      //   si_code: new FormControl(''),
      //   ref_code: new FormControl(''),
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
      //   isqty: new FormControl(''),
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
  })

  getCommonControls(): AbstractControl[] {
    return (this.thirdPartyGstDebitForm.get('thirdPartyGst_Debit_nested') as FormArray).controls;
  }
  someMethod() {
    this.cdRef.detectChanges();
  }

  getQtyControl(index: number): FormControl {
    const control = (
      this.thirdPartyGstDebitForm.get(
        'thirdPartyGst_Debit_nested'
      ) as FormArray
    )
      .at(index)
      ?.get('return_qty') as FormControl;
    return control;
  }

  isQtyControlInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }

  getSiCodeControl(index: number): FormControl {
    const control = (
      this.thirdPartyGstDebitForm.get(
        'thirdPartyGst_Debit_nested'
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
    const Control = this.thirdPartyGstDebitForm.get('thirdPartyGst_Debit_nested') as FormArray;
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
    const newArray = this.thirdPartyDetailsList.filter((e) => {
      return e.third_partyid == this.thirdPartyGstDebitForm.value.third_partyid;
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
    const Control = this.thirdPartyGstDebitForm.get('thirdPartyGst_Debit_nested') as FormArray;
    const FormTotal = Control.value.reduce((acc: any, val: any) => (acc += Number(val.net_total)), 0);
    this.thirdPartyGstDebitForm.get('total')?.setValue(String(FormTotal.toFixed(2)));

    const FormReturnTotal = Control.value.reduce((acc: any, val: any) => (acc += Number(val.return_net_total)), 0);
    this.thirdPartyGstDebitForm.get('return_total')?.setValue(String(FormReturnTotal.toFixed(2)));
  }

  async getReport(item: any) {
    const nestedArray = await this.TPPGSTDSVC.getThirdPartyGstDebitNestedList(item.thirdPartyDebitid).toPromise();
    this.TPPGSTRR.openConfirmDialog(item, nestedArray).afterClosed().subscribe((res) => {
      if (res == true) {
      }
    });
  }

  async update(item: any) {
    await this.cancelClick();
    await this.setThirdPartyDetails(item.third_partyid);
    const nestedArray = await this.TPPGSTDSVC.getThirdPartyGstDebitNestedList(item.thirdPartyDebitid).toPromise();
    const control = <FormArray><unknown>(this.thirdPartyGstDebitForm.controls['thirdPartyGst_Debit_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      this.thirdPartyGstDebitForm.patchValue(item);
      this.thirdPartyGstDebitForm.get('cuid')?.setValue(this.userID);

      nestedArray?.forEach(async (e, i) => {
        const filteredItems = this.itemMasterList.filter(
          (ee) => ee.brandid == e.brandid
        );
        // Assign filtered list to newItemList for the corresponding index
        if (filteredItems && filteredItems.length > 0) {
          this.newItemList[e.brandid] = filteredItems;
        }
        const newControl = new FormGroup({
          thirdPartyDebit_n_id: new FormControl(e.thirdPartyDebit_n_id),
          purchase_n_id: new FormControl(e.purchase_n_id),
          purchaseid: new FormControl(e.purchaseid),
          ref_code: new FormControl(e.ref_code),
          si_code: new FormControl(e.si_code),
          brandid: new FormControl(e.brandid),
          itemid: new FormControl(e.itemid),
          hsn_number: new FormControl(e.hsn_number),
          gst_percentage: new FormControl(e.gst_percentage),
          price: new FormControl(e.price),
          discount: new FormControl(e.discount),
          qty: new FormControl(e.qty),
          return_qty: new FormControl(e.return_qty, [
            Validators.required,
            Validators.pattern(/^\d+(\.\d{1,2})?$/),
          ]),
          isqty: new FormControl(e.qty),
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
          this.thirdPartyGstDebitForm.get(
            'thirdPartyGst_Debit_nested'
          ) as FormArray
        ).push(newControl);
        this.someMethod();
      });
    }
  }

  async save() {
    if (this.thirdPartyGstDebitForm.valid) {
      const res = await this.DialogSvc.openConfirmDialog('Are you sure want to add this record ?').afterClosed().toPromise();
      if (res == true) {
        await this.findBillNo();
        var value = this.thirdPartyGstDebitForm.value;
        this.TPPGSTDSVC.addNew(value).subscribe((res) => {
          if (res.status == 'Saved successfully') {
            this.notificationSvc.success('Saved Success');
            this.cancelClick();
          } else if (res.status == 'Alredy') {
            this.notificationSvc.warn('Return No or Invoice No already exists!');
          } else {
            this.notificationSvc.error('Something error');
          }
        });
      }
    } else {
      this.thirdPartyGstDebitForm.markAllAsTouched();
      this.notificationSvc.error('Some required input are missing!');
    }
  }
  async cancelClick() {
    this.thirdPartyGstDebitForm.reset();
    const control = <FormArray><unknown>(this.thirdPartyGstDebitForm.controls['thirdPartyGst_Debit_nested']);
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.thirdPartyGstDebitForm.get('thirdPartyDebitid')?.setValue(0);
    this.thirdPartyGstDebitForm.get('third_partyid')?.setValue(null);
    this.thirdPartyGstDebitForm.get('purchase_date')?.setValue('');
    this.thirdPartyGstDebitForm.get('invoice_no')?.setValue('');
    this.thirdPartyGstDebitForm.get('invoice_date')?.setValue('');
    this.thirdPartyGstDebitForm.get('return_no')?.setValue('');
    this.thirdPartyGstDebitForm.get('return_date')?.setValue(this.today);
    this.thirdPartyGstDebitForm.get('return_total')?.setValue('');
    this.thirdPartyGstDebitForm.get('cuid')?.setValue(this.userID);
    this.thirdPartyGstDebitForm.get('companyid')?.setValue(this.companyID);
    this.billNoList = [];
    this.billNoListsug = [];
    this.getThirdPartyList();
    this.getThirdPartygstpurchaseDebitList(this.today);
    this.findBillNo();
  }

}
