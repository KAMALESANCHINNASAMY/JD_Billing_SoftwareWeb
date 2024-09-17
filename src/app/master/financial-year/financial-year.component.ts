import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { NotificationsService } from 'angular2-notifications';
import { FormControl, FormGroup } from '@angular/forms';
import { financialYearService } from 'src/app/api-service/financialYear.service';
import { ElementRef, ViewChild } from '@angular/core';
@Component({
  selector: 'app-financial-year',
  templateUrl: './financial-year.component.html',
  styleUrl: './financial-year.component.scss',
})
export class FinancialYearComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  financialYearList: any[] = [];
  ActiveFinYr: any[] = [];

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private FYDSVC: financialYearService
  ) { }

  ngOnInit() {
    this.getFinancialYearDetails();
    this.cancelClick();
    this.getActiveFinYr();
  }

  financialYrDetails = new FormGroup({
    finyearid: new FormControl(0),
    companyid: new FormControl(this.companyID),
    finyear: new FormControl(''),
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    cuid: new FormControl(this.userID),
  });

  getFinancialYearDetails() {
    this.FYDSVC.getFinancialYrList(this.companyID).subscribe((res) => {
      this.financialYearList = res;
    });
  }

  getMinDate(): string | null {
    if (this.ActiveFinYr && this.ActiveFinYr.length > 0 && this.ActiveFinYr[0]?.todate) {
      const toDate = new Date(this.ActiveFinYr[0].todate);
      toDate.setDate(toDate.getDate() + 1); // Adding one day
      const minDate = toDate.toISOString().slice(0, 10); // Formatting as 'YYYY-MM-DD'
      return minDate;
    }
    return null;
  }



  getActiveFinYr() {
    this.FYDSVC.getActiveFinYear(this.companyID).subscribe((res) => {
      this.ActiveFinYr = res;
    })
  }

  ActiveStatusClick(finyearid: any) {
    this.FYDSVC.setActiveFinYear(finyearid, this.companyID).subscribe((res) => {
      if (res?.recordid) {
        this.cancelClick();
        window.location.reload();
      }
    });
  }

  save() {
    if (this.financialYrDetails.valid) {
      if (this.financialYrDetails.value.finyearid == 0) {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to add this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var yearInsert = this.financialYrDetails.value;
              this.FYDSVC.newFinancialYear(yearInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved success');
                  this.cancelClick();
                  this.getFinancialYearDetails();
                } else {
                  this.notificationSvc.error('Something error');
                }
              });
            }
          });
      } else {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to edit this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var yearInsert = this.financialYrDetails.value;
              this.FYDSVC.newFinancialYear(yearInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Successfully');
                  this.cancelClick();
                  this.getFinancialYearDetails();
                } else {
                  this.notificationSvc.error('Something error');
                }
              });
            }
          });
      }
    } else {
      this.financialYrDetails.markAllAsTouched();
    }
  }

  cancelClick() {
    this.financialYrDetails.reset();
    this.getFinancialYearDetails();

    this.financialYrDetails.get('finyearid')?.setValue(0);
    this.financialYrDetails.get('finyear')?.setValue('');
    this.financialYrDetails.get('companyid')?.setValue(this.companyID);
    this.financialYrDetails.get('fromdate')?.setValue('');
    this.financialYrDetails.get('todate')?.setValue('');
    this.financialYrDetails.get('cuid')?.setValue(this.userID);
  }
  updateGetClick(value: any) {
    this.financialYrDetails.get('finyearid')?.setValue(value.finyearid);
    this.financialYrDetails.get('finyear')?.setValue(value.finyear);
    this.financialYrDetails.get('companyid')?.setValue(this.companyID);
    this.financialYrDetails.get('fromdate')?.setValue(value.fromdate);
    this.financialYrDetails.get('todate')?.setValue(value.todate);
    this.financialYrDetails.get('cuid')?.setValue(this.userID);

    this.scrollToTableTop();
  }

  deleteClick(finyearid: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.FYDSVC.deleteFinYear(finyearid).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
