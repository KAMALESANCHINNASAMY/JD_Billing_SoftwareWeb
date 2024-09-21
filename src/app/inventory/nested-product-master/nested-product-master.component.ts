import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { itemGroupService } from 'src/app/api-service/itemGroup.service';
import { nestedProductMasterService } from 'src/app/api-service/nestedProductMaster.service';
import { unitMasterService } from 'src/app/api-service/unitMaster.service';


@Component({
  selector: 'app-nested-product-master',
  templateUrl: './nested-product-master.component.html',
  styleUrl: './nested-product-master.component.scss'
})
export class NestedProductMasterComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  NestedProductList: any[] = [];
  unitMasterList: any[] = [];
  itemGroupList: any[] = [];
  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private nPSvc: nestedProductMasterService,
    private UNITMSVC: unitMasterService,
    private ITMGRPSVC: itemGroupService
  ) { }

  ngOnInit(): void {
    this.getNProductList();
    this.getUnitMasterDetails();
    this.getItemGrpDetails();
  }
  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getNProductList() {
    this.nPSvc.getList(this.companyID).subscribe((res) => {
      this.NestedProductList = res
    })
  }

  getUnitMasterDetails() {
    this.UNITMSVC.getUnitsList(this.companyID).subscribe((res) => {
      this.unitMasterList = res;
    });
  }
  getItemGrpDetails() {
    this.ITMGRPSVC.getItemGroupList(this.companyID).subscribe((res) => {
      this.itemGroupList = res;
    });
  }

  updateHsnIdGstId() {
    const id = this.nProductMasterForm.value.item_groupid;
    const newItem = this.itemGroupList.find((e) => { return e.item_groupid == id });
    this.nProductMasterForm.get('gst_percentage')?.setValue(newItem.gst_percentage);
    this.nProductMasterForm.get('hsn_number')?.setValue(newItem.hsn_number);
  }

  nProductMasterForm = new FormGroup({
    n_productid: new FormControl(0),
    n_product_name: new FormControl(''),
    unitid: new FormControl(null, [Validators.required]),
    item_groupid: new FormControl(null, [Validators.required]),
    gst_percentage: new FormControl(''),
    hsn_number: new FormControl(''),
    companyid: new FormControl(this.companyID),
    cuid: new FormControl(this.userID)
  });

  Save() {
    if (this.nProductMasterForm.valid) {
      if (this.nProductMasterForm.value.n_productid == 0) {
        this.DialogSvc.openConfirmDialog('Are you sure want to add this record ?').afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var value = this.nProductMasterForm.value;
              this.nPSvc.newNProduct(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Product Name already exists! Use a different Product Name');
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
              var value = this.nProductMasterForm.value;
              this.nPSvc.newNProduct(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Product Name already exists! Use a different Product Name');
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
      this.nProductMasterForm.markAllAsTouched();
    }
  }

  UpdateGetClick(item: any) {
    this.nProductMasterForm.patchValue(item);
    this.nProductMasterForm.get('cuid')?.setValue(this.userID);
    this.scrollToTableTop();
  }

  deleteClick(id: number) {
    this.DialogSvc.openConfirmDialog('Are you sure want to delete this record ?').afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.nPSvc.delete(id).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  cancelClick() {
    this.nProductMasterForm.reset();
    this.nProductMasterForm.get('n_productid')?.setValue(0);
    this.nProductMasterForm.get('n_product_name')?.setValue('');
    this.nProductMasterForm.get('unitid')?.setValue(null);
    this.nProductMasterForm.get('item_groupid')?.setValue(null);
    this.nProductMasterForm.get('gst_percentage')?.setValue('');
    this.nProductMasterForm.get('hsn_number')?.setValue('');
    this.nProductMasterForm.get('companyid')?.setValue(this.companyID);
    this.nProductMasterForm.get('cuid')?.setValue(this.userID);

    this.getNProductList();
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
