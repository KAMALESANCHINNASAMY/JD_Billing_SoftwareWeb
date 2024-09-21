import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { itemGroupService } from 'src/app/api-service/itemGroup.service';
import { productMasterService } from 'src/app/api-service/productMaster.service';
import { unitMasterService } from 'src/app/api-service/unitMaster.service';

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrl: './product-master.component.scss'
})
export class ProductMasterComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  productList: any[] = [];
  unitMasterList: any[] = [];
  itemGroupList: any[] = [];
  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private pSvc: productMasterService,
    private UNITMSVC: unitMasterService,
    private ITMGRPSVC: itemGroupService
  ) { }

  ngOnInit(): void {
    this.getProductList();
    this.getUnitMasterDetails();
    this.getItemGrpDetails();
  }
  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getProductList() {
    this.pSvc.getList(this.companyID).subscribe((res) => {
      this.productList = res
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
    const id = this.productMasterForm.value.item_groupid;
    const newItem = this.itemGroupList.find((e) => { return e.item_groupid == id });
    this.productMasterForm.get('gst_percentage')?.setValue(newItem.gst_percentage);
    this.productMasterForm.get('hsn_number')?.setValue(newItem.hsn_number);
  }

  productMasterForm = new FormGroup({
    productid: new FormControl(0),
    product_name: new FormControl(''),
    unitid: new FormControl(null, [Validators.required]),
    item_groupid: new FormControl(null, [Validators.required]),
    gst_percentage: new FormControl(''),
    hsn_number: new FormControl(''),
    companyid: new FormControl(this.companyID),
    cuid: new FormControl(this.userID)
  });

  Save() {
    if (this.productMasterForm.valid) {
      if (this.productMasterForm.value.productid == 0) {
        this.DialogSvc.openConfirmDialog('Are you sure want to add this record ?').afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var value = this.productMasterForm.value;
              this.pSvc.newProduct(value).subscribe((res) => {
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
              var value = this.productMasterForm.value;
              this.pSvc.newProduct(value).subscribe((res) => {
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
      this.productMasterForm.markAllAsTouched();
    }
  }

  UpdateGetClick(item: any) {
    this.productMasterForm.patchValue(item);
    this.productMasterForm.get('cuid')?.setValue(this.userID);
    this.scrollToTableTop();
  }

  deleteClick(id: number) {
    this.DialogSvc.openConfirmDialog('Are you sure want to delete this record ?').afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.pSvc.delete(id).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  cancelClick() {
    this.productMasterForm.reset();
    this.productMasterForm.get('productid')?.setValue(0);
    this.productMasterForm.get('product_name')?.setValue('');
    this.productMasterForm.get('unitid')?.setValue(null);
    this.productMasterForm.get('item_groupid')?.setValue(null);
    this.productMasterForm.get('gst_percentage')?.setValue('');
    this.productMasterForm.get('hsn_number')?.setValue('');
    this.productMasterForm.get('companyid')?.setValue(this.companyID);
    this.productMasterForm.get('cuid')?.setValue(this.userID);

    this.getProductList();
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
