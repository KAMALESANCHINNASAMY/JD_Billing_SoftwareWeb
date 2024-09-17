import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { hsnMasterService } from 'src/app/api-service/hsnGroup.service';
import { itemGroupService } from 'src/app/api-service/itemGroup.service';

@Component({
  selector: 'app-item-group',
  templateUrl: './item-group.component.html',
  styleUrl: './item-group.component.scss',
})
export class ItemGroupComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  itemGroupList: any[] = [];
  hsnGroupList: any[] = [];

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private HSNMSTC: hsnMasterService,
    private ITMGRPSVC: itemGroupService
  ) { }

  ngOnInit() {
    this.getHSNGroupDetails();
    this.getItemGrpDetails();
  }

  itemGroupDetails = new FormGroup({
    item_groupid: new FormControl(0),
    companyid: new FormControl(this.companyID),
    item_group_name: new FormControl(''),
    hsnid: new FormControl(null, [Validators.required]),
    gst_percentage: new FormControl(''),
    cuid: new FormControl(this.userID),
  });

  getHSNGroupDetails() {
    this.HSNMSTC.getHSNGroup(this.companyID).subscribe((res) => {
      this.hsnGroupList = res;
    });
  }
  getItemGrpDetails() {
    this.ITMGRPSVC.getItemGroupList(this.companyID).subscribe((res) => {
      this.itemGroupList = res;
    });
  }
  save() {
    if (this.itemGroupDetails.valid) {
      if (this.itemGroupDetails.value.item_groupid == 0) {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to add this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var itemGroupInsert = this.itemGroupDetails.value;
              this.ITMGRPSVC.newItemGroupIns(itemGroupInsert).subscribe(
                (res) => {
                  if (res.status == 'Saved successfully') {
                    this.notificationSvc.success('Saved Success');
                    this.cancelClick();
                  }
                  else if (res.status == 'Alredy') {
                    this.notificationSvc.warn('Group Name already exists! Use a different Group Name');
                  }
                  else {
                    this.notificationSvc.error('Something Error');
                  }
                }
              );
            }
          });
      } else {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to edit this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var itemGroupInsert = this.itemGroupDetails.value;
              this.ITMGRPSVC.newItemGroupIns(itemGroupInsert).subscribe(
                (res) => {
                  if (res.status == 'Saved successfully') {
                    this.notificationSvc.success('Saved successfully');
                    this.cancelClick();
                  }
                  else if (res.status == 'Alredy') {
                    this.notificationSvc.warn('Group Name already exists! Use a different Group Name');
                  }
                  else {
                    this.notificationSvc.error('Something Error');
                  }
                }
              );
            }
          });
      }
    } else {
      this.itemGroupDetails.markAllAsTouched();
    }
  }

  updateGetClick(value: any) {
    this.itemGroupDetails.patchValue(value);
    this.itemGroupDetails.get('companyid')?.setValue(this.companyID);
    this.itemGroupDetails.get('cuid')?.setValue(this.userID);
    this.scrollToTableTop();
  }

  deleteClick(item_groupid: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.ITMGRPSVC.deleteItemGroup(item_groupid).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Delete Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  updateGstId() {
    const selectedGstId = this.itemGroupDetails.value.hsnid;
    const newArray = this.hsnGroupList.filter((e) => {
      return e.hsnid == selectedGstId;
    });
    this.itemGroupDetails.get('gst_percentage')?.setValue(newArray[0].gst_percentage);
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  cancelClick() {
    this.itemGroupDetails.reset();
    this.getItemGrpDetails();

    this.itemGroupDetails.get('companyid')?.setValue(this.companyID);
    this.itemGroupDetails.get('item_groupid')?.setValue(0);
    this.itemGroupDetails.get('item_group_name')?.setValue('');
    this.itemGroupDetails.get('hsnid')?.setValue(null);
    this.itemGroupDetails.get('gst_percentage')?.setValue('');
    this.itemGroupDetails.get('cuid')?.setValue(this.userID);
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
