import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { expenseMasterService } from 'src/app/api-service/expense.service';

@Component({
  selector: 'app-expense-master',
  templateUrl: './expense-master.component.html',
  styleUrl: './expense-master.component.scss'
})
export class ExpenseMasterComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  expenseList: any[] = [];
  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private bSvc: expenseMasterService
  ) { }

  ngOnInit(): void {
    this.getExpenseList();
  }
  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getExpenseList() {
    this.bSvc.getList(this.companyID).subscribe((res) => {
      this.expenseList = res
    })
  }
  expenseMasterForm = new FormGroup({
    expenseid: new FormControl(0),
    expense_name: new FormControl(''),
    companyid: new FormControl(this.companyID),
    cuid: new FormControl(this.userID)
  });

  Save() {
    if (this.expenseMasterForm.valid) {
      if (this.expenseMasterForm.value.expenseid == 0) {
        this.DialogSvc.openConfirmDialog('Are you sure want to add this record ?').afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var value = this.expenseMasterForm.value;
              this.bSvc.newExpense(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Expense Name already exists! Use a different Expense Name');
                }
                else {
                  this.notificationSvc.error('Something error');
                }
              });
            }
          });
      } else {
        this.DialogSvc.openConfirmDialog('Are you sure want to edit this record ?').afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var value = this.expenseMasterForm.value;
              this.bSvc.newExpense(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Expense Name already exists! Use a different Expense Name');
                }
                else {
                  this.notificationSvc.error('Something error');
                }
              });
            }
          });
      }
    }
    else {
      this.expenseMasterForm.markAllAsTouched();
    }
  }

  UpdateGetClick(item: any) {
    this.expenseMasterForm.patchValue(item);
    this.expenseMasterForm.get('cuid')?.setValue(this.userID);
    this.scrollToTableTop();
  }

  deleteClick(id: number) {
    this.DialogSvc.openConfirmDialog('Are you sure want to delete this record ?').afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.bSvc.delete(id).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  cancelClick() {
    this.expenseMasterForm.reset();
    this.expenseMasterForm.get('expenseid')?.setValue(0);
    this.expenseMasterForm.get('expense_name')?.setValue('');
    this.expenseMasterForm.get('companyid')?.setValue(this.companyID);
    this.expenseMasterForm.get('cuid')?.setValue(this.userID);

    this.getExpenseList();
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
