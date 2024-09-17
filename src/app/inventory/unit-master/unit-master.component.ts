import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { unitMasterService } from 'src/app/api-service/unitMaster.service';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-unit-master',
  templateUrl: './unit-master.component.html',
  styleUrl: './unit-master.component.scss',
})
export class UnitMasterComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  unitMasterList: any[] = [];

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private UNITMSVC: unitMasterService
  ) {
  }
  ngOnInit() {
    this.getUnitMasterDetails();
  }

  unitMasterDetails = new FormGroup({
    unitid: new FormControl(0),
    unit_name: new FormControl(''),
    unit_code: new FormControl(''),
    companyid: new FormControl(this.companyID),
    cuid: new FormControl(this.userID)
  });

  getUnitMasterDetails() {
    this.UNITMSVC.getUnitsList(this.companyID).subscribe((res) => {
      this.unitMasterList = res;
    });
  }

  save() {
    if (this.unitMasterDetails.valid) {
      if (this.unitMasterDetails.value.unitid == 0) {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to add this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var unitInsert = this.unitMasterDetails.value;
              this.UNITMSVC.newUnit(unitInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved sucess');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Unit code already exists! Use a different unit code');
                }
                else {
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
              var unitInsert = this.unitMasterDetails.value;
              this.UNITMSVC.newUnit(unitInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Successfully');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Unit code already exists! Use a different unit code');
                }
                else {
                  this.notificationSvc.error('Something error');
                }
              });
            }
          });
      }
    } else {
      this.unitMasterDetails.markAllAsTouched();
    }
  }

  cancelClick() {
    this.unitMasterDetails.reset();
    this.getUnitMasterDetails();

    this.unitMasterDetails.get('unitid')?.setValue(0);
    this.unitMasterDetails.get('unit_name')?.setValue('');
    this.unitMasterDetails.get('unit_code')?.setValue('');
    this.unitMasterDetails.get('companyid')?.setValue(this.companyID);
    this.unitMasterDetails.get('cuid')?.setValue(this.userID);
  }

  updateGetClick(value: any) {
    this.unitMasterDetails.patchValue(value);
    this.unitMasterDetails.get('companyid')?.setValue(this.companyID);
    this.unitMasterDetails.get('cuid')?.setValue(this.userID);

    this.scrollToTableTop();
  }

  deleteClick(unitid: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.UNITMSVC.deleteUnit(unitid).subscribe((res) => {
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
