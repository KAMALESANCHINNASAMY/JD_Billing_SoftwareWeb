import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { linkProductMasterService } from 'src/app/api-service/linkProduct.service';
import { nestedProductMasterService } from 'src/app/api-service/nestedProductMaster.service';
import { productMasterService } from 'src/app/api-service/productMaster.service';

@Component({
  selector: 'app-link-product-master',
  templateUrl: './link-product-master.component.html',
  styleUrl: './link-product-master.component.scss'
})
export class LinkProductMasterComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  NestedProductList: any[] = [];
  productList: any[] = [];
  linkProductList: any[] = [];
  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private nPSvc: nestedProductMasterService,
    private pSvc: productMasterService,
    private lPSvc: linkProductMasterService
  ) { }

  ngOnInit(): void {
    this.getNProductList();
    this.getProductList();
    this.getLinkProductList();
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getProductList() {
    this.pSvc.getList(this.companyID).subscribe((res) => {
      this.productList = res
    })
  }

  getNProductList() {
    this.nPSvc.getList(this.companyID).subscribe((res) => {
      this.NestedProductList = res
    })
  }

  getLinkProductList() {
    this.lPSvc.getList(this.companyID).subscribe((res) => {
      this.linkProductList = res
    })
  }

  linkProductMasterForm = new FormGroup({
    linkid: new FormControl(0),
    productid: new FormControl(null),
    companyid: new FormControl(this.companyID),
    cuid: new FormControl(this.userID),
    linkproduct_nested: new FormArray([
      new FormGroup({
        link_n_id: new FormControl(0),
        n_productid: new FormControl(null, [Validators.required]),
        a_qty: new FormControl(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)])
      })
    ])
  });

  getCommonControls(): AbstractControl[] {
    return (this.linkProductMasterForm.get('linkproduct_nested') as FormArray).controls;
  }

  addNesForm() {
    const newControl = new FormGroup({
      link_n_id: new FormControl(0),
      n_productid: new FormControl(null, [Validators.required]),
      a_qty: new FormControl(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)])
    });
    (this.linkProductMasterForm.get('linkproduct_nested') as FormArray).push(newControl);
    //this.someMethod(); // Trigger change detection
  }

  removeNesForm(index: number) {
    (this.linkProductMasterForm.get('linkproduct_nested') as FormArray).removeAt(index);
    //this.someMethod(); // Trigger change detection
  }

  getPurchaseProControl(index: number): FormControl {
    const control = (this.linkProductMasterForm.get('linkproduct_nested') as FormArray).at(index)?.get('n_productid') as FormControl;
    return control;
  }

  isPurchaseProInvalid(index: number): boolean {
    const control = this.getPurchaseProControl(index);
    return control.touched && !!control.errors;
  }

  getQtyControl(index: number): FormControl {
    const control = (this.linkProductMasterForm.get('linkproduct_nested') as FormArray).at(index)?.get('a_qty') as FormControl;
    return control;
  }

  isqtyInvalid(index: number): boolean {
    const control = this.getQtyControl(index);
    return control.touched && !!control.errors;
  }

  Save() {
    if (this.linkProductMasterForm.valid) {
      if (this.linkProductMasterForm.value.linkid == 0) {
        this.DialogSvc.openConfirmDialog('Are you sure want to add this record ?').afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var value = this.linkProductMasterForm.value;
              this.lPSvc.newLinkProduct(value).subscribe((res) => {
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
              var value = this.linkProductMasterForm.value;
              this.lPSvc.newLinkProduct(value).subscribe((res) => {
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
      this.linkProductMasterForm.markAllAsTouched();
    }
  }

  async UpdateGetClick(item: any) {
    const nestedList = await this.lPSvc.getNestedList(item.linkid).toPromise();
    const control = <FormArray>this.linkProductMasterForm.controls['linkproduct_nested'];
    while (control.length !== 0) {
      control.removeAt(0);
    }

    if (control.length == 0) {
      this.linkProductMasterForm.patchValue(item);
      this.linkProductMasterForm.get('cuid')?.setValue(this.userID);
      nestedList?.forEach(async (e, i) => {
        const newControl = new FormGroup({
          link_n_id: new FormControl(e.link_n_id),
          n_productid: new FormControl(e.n_productid, [Validators.required]),
          a_qty: new FormControl(e.a_qty, [Validators.required, Validators.pattern(/^\d+(\.\d{1,})?$/)])
        });
        (this.linkProductMasterForm.get('linkproduct_nested') as FormArray).push(
          newControl
        );
        // this.someMethod();
      });
    }
    this.scrollToTableTop();
  }

  deleteClick(id: number) {
    this.DialogSvc.openConfirmDialog('Are you sure want to delete this record ?').afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.lPSvc.delete(id).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  cancelClick() {
    this.linkProductMasterForm.reset();
    const control = <FormArray>this.linkProductMasterForm.controls['linkproduct_nested'];
    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.addNesForm();
    this.linkProductMasterForm.get('linkid')?.setValue(0);
    this.linkProductMasterForm.get('productid')?.setValue(null);
    this.linkProductMasterForm.get('companyid')?.setValue(this.companyID);
    this.linkProductMasterForm.get('cuid')?.setValue(this.userID);
    this.getLinkProductList();
    console.log(this.linkProductMasterForm)
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
