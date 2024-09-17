import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { itemMasterService } from 'src/app/api-service/itemMaster.service';
import { unitMasterService } from 'src/app/api-service/unitMaster.service';
import { gstMasterService } from 'src/app/api-service/gstMaster.service';
import { hsnMasterService } from 'src/app/api-service/hsnGroup.service';
import { itemGroupService } from 'src/app/api-service/itemGroup.service';
import { brandMasterService } from 'src/app/api-service/brandMaster.service';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrl: './item-master.component.scss',
})
export class ItemMasterComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  itemMasterList: any[] = [];
  MaxId: any = [];
  unitMasterList: any[] = [];
  gstMasterList: any[] = [];
  hsnGroupList: any[] = [];
  itemGroupList: any[] = [];
  filteredHsnList: any[] = [];
  filteredGstList: any[] = [];
  brandList: any[] = [];

  ngOnInit() {
    this.getItemMasterDetails();
    this.getMaxId();
    this.getItemGrpDetails();
    this.getBrandList();
    this.getUnitMasterDetails();
  }

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private ITMSRC: itemMasterService,
    private UNITMSVC: unitMasterService,
    private GSTMSVC: gstMasterService,
    private HSNMSTC: hsnMasterService,
    private ITMGRPSVC: itemGroupService,
    private bSvc: brandMasterService
  ) { }

  itemMasterDetails = new FormGroup({
    itemid: new FormControl(0),
    companyid: new FormControl(this.companyID),
    unitid: new FormControl(null, [Validators.required]),
    gst_percentage: new FormControl(''),
    hsn_number: new FormControl(''),
    item_groupid: new FormControl(null, [Validators.required]),
    item_code: new FormControl(''),
    item_name: new FormControl(''),
    brandid: new FormControl(null, [Validators.required]),
    cuid: new FormControl(this.userID),
  });

  getHSNGroupDetails() {
    this.HSNMSTC.getHSNGroup(this.companyID).subscribe((res) => {
      this.hsnGroupList = res;
    });
  }

  getBrandList() {
    this.bSvc.getList(this.companyID).subscribe((res) => {
      this.brandList = res;
    });
  }

  getItemGrpDetails() {
    this.ITMGRPSVC.getItemGroupList(this.companyID).subscribe((res) => {
      this.itemGroupList = res;
    });
  }

  getGstMasterDetails() {
    this.GSTMSVC.getGstMaster(this.companyID).subscribe((res) => {
      this.gstMasterList = res;
    });
  }

  getUnitMasterDetails() {
    this.UNITMSVC.getUnitsList(this.companyID).subscribe((res) => {
      this.unitMasterList = res;
    });
  }

  getItemMasterDetails() {
    this.ITMSRC.getItemMasterList(this.companyID).subscribe((res) => {
      this.itemMasterList = res;
    });
  }

  getMaxId() {
    this.ITMSRC.getMaxId(this.companyID).subscribe((data) => {
      this.MaxId = data;
    });
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  save() {
    if (this.itemMasterDetails.valid) {
      if (this.itemMasterDetails.value.itemid == 0) {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to add this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var itemInsert = this.itemMasterDetails.value;
              let itemid: number = this.MaxId[0].itemid;
              let itemCode: string;

              if (itemid < 10) {
                itemCode = '00' + itemid;
              } else if (itemid < 100) {
                itemCode = '0' + itemid;
              } else {
                itemCode = itemid.toString();
              }

              itemInsert.item_code = itemCode;
              this.ITMSRC.newItem(itemInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved success');
                  this.cancelClick();
                  this.getMaxId();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Item Name already exists! Use a different Item Name');
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
              var itemInsert = this.itemMasterDetails.value;
              this.ITMSRC.newItem(itemInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Successfully');
                  this.cancelClick();
                  this.getMaxId();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Item Name already exists! Use a different Item Name');
                }
                else {
                  this.notificationSvc.error('Something error');
                }
              });
            }
          });
      }
    } else {
      this.itemMasterDetails.markAllAsTouched();
    }
  }

  updateHsnIdGstId() {
    const selectedGstId = this.itemMasterDetails.value.item_groupid;
    const newArray = this.itemGroupList.filter((e) => {
      return e.item_groupid == selectedGstId;
    });
    this.itemMasterDetails.get('gst_percentage')?.setValue(newArray[0].gst_percentage);
    this.itemMasterDetails.get('hsn_number')?.setValue(newArray[0].hsn_number);
  }

  updateGetClick(value: any) {
    this.itemMasterDetails.patchValue(value);
    this.itemMasterDetails.get('companyid')?.setValue(this.companyID);
    this.itemMasterDetails.get('cuid')?.setValue(this.userID);

    this.scrollToTableTop();
  }

  deleteClick(itemid: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.ITMSRC.deleteItem(itemid).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
              this.getMaxId();
            }
          });
        }
      });
  }
  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  cancelClick() {
    this.itemMasterDetails.reset();
    this.getItemMasterDetails();

    this.itemMasterDetails.get('companyid')?.setValue(this.companyID);
    this.itemMasterDetails.get('itemid')?.setValue(0);
    this.itemMasterDetails.get('unitid')?.setValue(null);
    this.itemMasterDetails.get('item_groupid')?.setValue(null);
    this.itemMasterDetails.get('item_code')?.setValue('');
    this.itemMasterDetails.get('item_name')?.setValue('');
    this.itemMasterDetails.get('gst_percentage')?.setValue('');
    this.itemMasterDetails.get('hsn_number')?.setValue('');
    this.itemMasterDetails.get('brandid')?.setValue(null);
    this.itemMasterDetails.get('cuid')?.setValue(this.userID);
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
