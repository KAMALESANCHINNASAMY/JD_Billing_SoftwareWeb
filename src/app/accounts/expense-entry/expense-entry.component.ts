import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { expenseEntryService } from 'src/app/api-service/Accounts/expenseEntry.service';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { expenseMasterService } from 'src/app/api-service/expense.service';

@Component({
  selector: 'app-expense-entry',
  templateUrl: './expense-entry.component.html',
  styleUrl: './expense-entry.component.scss'
})
export class ExpenseEntryComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  expenseEntryList: any[] = [];
  expenseMasterList: any[] = [];
  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private cdRef: ChangeDetectorRef,
    private cMSvc: expenseEntryService,
    private bSvc: expenseMasterService
  ) { }

  ngOnInit(): void {
    this.getExpenseList();
    this.getExpenseMasterList();
  }
  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getExpenseList() {
    this.cMSvc.getList(this.companyID).subscribe((res) => {
      this.expenseEntryList = res;
    });
  }

  getExpenseMasterList() {
    this.bSvc.getList(this.companyID).subscribe((res) => {
      this.expenseMasterList = res
    })
  }

  expenseEntryForm = new FormGroup({
    newList: new FormArray([
      new FormGroup({
        entryid: new FormControl(0),
        expenseid: new FormControl(null),
        amount: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        date: new FormControl('', Validators.required),
        description: new FormControl(''),
        issale_am: new FormControl(false),
        ishand_cash_am: new FormControl(true),
        companyid: new FormControl(this.companyID),
        cuid: new FormControl(this.userID)
      }),
    ]),
  });

  getCommonControls(): AbstractControl[] {
    return (this.expenseEntryForm.get('newList') as FormArray).controls;
  }

  addNesForm() {
    const newControl = new FormGroup({
      entryid: new FormControl(0),
      expenseid: new FormControl(null),
      amount: new FormControl('0.00', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      date: new FormControl('', Validators.required),
      description: new FormControl(''),
      issale_am: new FormControl(false),
      ishand_cash_am: new FormControl(true),
      companyid: new FormControl(this.companyID),
      cuid: new FormControl(this.userID)
    });
    (this.expenseEntryForm.get('newList') as FormArray).push(newControl);
    this.someMethod(); // Trigger change detection
  }

  removeNesForm(index: number) {
    (this.expenseEntryForm.get('newList') as FormArray).removeAt(index);
    this.someMethod(); // Trigger change detection
  }

  someMethod() {
    this.cdRef.detectChanges();
  }

  getExControl(index: number): FormControl {
    const control = (this.expenseEntryForm.get('newList') as FormArray).at(index)?.get('expenseid') as FormControl;
    return control;
  }

  isExpenseControlInvalid(index: number): boolean {
    const control = this.getExControl(index);
    return control.touched && !!control.errors;
  }

  getamountControl(index: number): FormControl {
    const control = (this.expenseEntryForm.get('newList') as FormArray).at(index)?.get('amount') as FormControl;
    return control;
  }

  isamountControlInvalid(index: number): boolean {
    const control = this.getamountControl(index);
    return control.touched && !!control.errors;
  }

  getdateControl(index: number): FormControl {
    const control = (this.expenseEntryForm.get('newList') as FormArray).at(index)?.get('date') as FormControl;
    return control;
  }

  isdateControlInvalid(index: number): boolean {
    const control = this.getdateControl(index);
    return control.touched && !!control.errors;
  }

  setAmountType(value: string, i: number) {
    const control = <FormArray>this.expenseEntryForm.controls['newList'];
    if (value == 'cash') {
      control.at(i).get('issale_am')?.setValue(false);
      control.at(i).get('ishand_cash_am')?.setValue(true);
    }
    else if (value == 'sale') {
      control.at(i).get('issale_am')?.setValue(true);
      control.at(i).get('ishand_cash_am')?.setValue(false);
    }
    else {
      control.at(i).get('issale_am')?.setValue(true);
      control.at(i).get('ishand_cash_am')?.setValue(false);
    }
  }

  Save() {
    const control = <FormArray>this.expenseEntryForm.controls['newList'];
    const isOk = control.value.some((e: any) => { return e.issale_am == e.ishand_cash_am });
    if (isOk) {
      this.notificationSvc.warn('Invalid Details!')
      return;
    }
    if (this.expenseEntryForm.valid) {
      this.DialogSvc.openConfirmDialog(
        'Are you sure want to add this record ?'
      )
        .afterClosed()
        .subscribe((res) => {
          if (res == true) {
            var value: any = this.expenseEntryForm.value.newList;
            this.cMSvc.newEntry(value).subscribe((res) => {
              if (res.status == 'Saved successfully') {
                this.notificationSvc.success('Saved Success');
                this.cancelClick();
              }
              else {
                this.notificationSvc.error('Something error');
              }
            });
          }
        });
    } else {
      this.expenseEntryForm.markAllAsTouched();
    }
  }

  async UpdateGetClick(item: any) {
    const control = <FormArray>this.expenseEntryForm.controls['newList'];
    while (control.length !== 0) {
      control.removeAt(0);
    }
    if (control.length == 0) {
      const newControl = new FormGroup({
        entryid: new FormControl(item.entryid),
        expenseid: new FormControl(item.expenseid),
        amount: new FormControl(item.amount, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        date: new FormControl(item.date, Validators.required),
        description: new FormControl(item.description),
        issale_am: new FormControl(item.issale_am),
        ishand_cash_am: new FormControl(item.ishand_cash_am),
        companyid: new FormControl(this.companyID),
        cuid: new FormControl(this.userID)
      });
      (this.expenseEntryForm.get('newList') as FormArray).push(newControl);
      this.someMethod(); // Trigger change detection
    }
    this.scrollToTableTop();
  }

  deleteClick(id: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.cMSvc.delete(id).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  cancelClick() {
    this.expenseEntryForm.reset();
    const control = <FormArray>this.expenseEntryForm.controls['newList'];
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.addNesForm();
    this.getExpenseList();
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
