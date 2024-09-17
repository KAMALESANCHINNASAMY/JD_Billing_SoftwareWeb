import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { productMasterService } from 'src/app/api-service/productMaster.service';

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrl: './product-master.component.scss'
})
export class ProductMasterComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  productList: any[] = [];
  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private pSvc: productMasterService
  ) { }

  ngOnInit(): void {
    this.getProductList();
  }
  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getProductList() {
    this.pSvc.getList(this.companyID).subscribe((res) => {
      this.productList = res
    })
  }
  productMasterForm = new FormGroup({
    productid: new FormControl(0),
    product_name: new FormControl(''),
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
    this.productMasterForm.get('companyid')?.setValue(this.companyID);
    this.productMasterForm.get('cuid')?.setValue(this.userID);

    this.getProductList();
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
