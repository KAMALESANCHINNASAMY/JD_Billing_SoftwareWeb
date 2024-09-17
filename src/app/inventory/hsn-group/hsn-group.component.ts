import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { gstMasterService } from 'src/app/api-service/gstMaster.service';
import { hsnMasterService } from 'src/app/api-service/hsnGroup.service';

@Component({
  selector: 'app-hsn-group',
  templateUrl: './hsn-group.component.html',
  styleUrl: './hsn-group.component.scss',
})
export class HsnGroupComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  hsnGroupList: any[] = [];
  gstMasterList: any[] = [];

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private HSNMSTC: hsnMasterService,
    private GSTMSVC: gstMasterService
  ) { }

  ngOnInit() {
    this.getHSNGroupDetails();
    this.getGstMasterDetails();
  }

  hsnGroupDetails = new FormGroup({
    hsnid: new FormControl(0),
    companyid: new FormControl(this.companyID),
    gstid: new FormControl(null, [Validators.required]),
    hsn_number: new FormControl(''),
    cuid: new FormControl(this.userID)
  });

  getGstMasterDetails() {
    this.GSTMSVC.getGstMaster(this.companyID).subscribe((res) => {
      this.gstMasterList = res;
    });
  }

  getHSNGroupDetails() {
    this.HSNMSTC.getHSNGroup(this.companyID).subscribe((res) => {
      this.hsnGroupList = res;
    });
  }

  async save() {
    if (this.hsnGroupDetails.valid) {
      if (this.hsnGroupDetails.value.hsnid == 0) {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to add this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var hsnInsert = this.hsnGroupDetails.value;
              this.HSNMSTC.newHSNGroup(hsnInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                } else if (res.status == 'Already') {
                  this.notificationSvc.warn('HSN/SAC Number already exists! Use a different HSN/SAC Number');
                } else {
                  this.notificationSvc.error('Something Error');
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
              var hsnInsert = this.hsnGroupDetails.value;
              this.HSNMSTC.newHSNGroup(hsnInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved successfully');
                  this.cancelClick();
                } else if (res.status == 'Already') {
                  this.notificationSvc.warn('HSN/SAC Number already exists! Use a different HSN/SAC Number');
                } else {
                  this.notificationSvc.error('Something Error');
                }
              });
            }
          });
      }
    } else {
      this.hsnGroupDetails.markAllAsTouched();
    }
  }

  updateGetClick(value: any) {
    this.hsnGroupDetails.patchValue(value);
    this.hsnGroupDetails.get('companyid')?.setValue(this.companyID);
    this.hsnGroupDetails.get('cuid')?.setValue(this.userID);

    this.scrollToTableTop();
  }

  deleteClick(hsnid: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.HSNMSTC.deleteHSNGroup(hsnid).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Delete Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  cancelClick() {
    this.hsnGroupDetails.reset();
    this.getHSNGroupDetails();

    this.hsnGroupDetails.get('companyid')?.setValue(this.companyID);
    this.hsnGroupDetails.get('hsnid')?.setValue(0);
    this.hsnGroupDetails.get('gstid')?.setValue(null);
    this.hsnGroupDetails.get('hsn_number')?.setValue('');
    this.hsnGroupDetails.get('cuid')?.setValue(this.userID);
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
