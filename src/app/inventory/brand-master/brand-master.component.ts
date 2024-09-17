import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { brandMasterService } from 'src/app/api-service/brandMaster.service';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-brand-master',
  templateUrl: './brand-master.component.html',
  styleUrl: './brand-master.component.scss'
})
export class BrandMasterComponent {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  brandList: any[] = [];
  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private bSvc: brandMasterService
  ) { }

  ngOnInit(): void {
    this.getBrandList();
    // this.generateBarcode();
    // this.checkCameraPermissions();
  }
  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  getBrandList() {
    this.bSvc.getList(this.companyID).subscribe((res) => {
      this.brandList = res
    })
  }
  brandMasterForm = new FormGroup({
    brandid: new FormControl(0),
    brand_name: new FormControl(''),
    companyid: new FormControl(this.companyID),
    cuid: new FormControl(this.userID)
  });

  Save() {
    if (this.brandMasterForm.valid) {
      if (this.brandMasterForm.value.brandid == 0) {
        this.DialogSvc.openConfirmDialog('Are you sure want to add this record ?').afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var value = this.brandMasterForm.value;
              this.bSvc.newBrand(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Brand Name already exists! Use a different Brand Name');
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
              var value = this.brandMasterForm.value;
              this.bSvc.newBrand(value).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('Brand Name already exists! Use a different Brand Name');
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
      this.brandMasterForm.markAllAsTouched();
    }
  }

  UpdateGetClick(item: any) {
    this.brandMasterForm.patchValue(item);
    this.brandMasterForm.get('cuid')?.setValue(this.userID);
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
    this.brandMasterForm.reset();
    this.brandMasterForm.get('brandid')?.setValue(0);
    this.brandMasterForm.get('brand_name')?.setValue('');
    this.brandMasterForm.get('companyid')?.setValue(this.companyID);
    this.brandMasterForm.get('cuid')?.setValue(this.userID);

    this.getBrandList();
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  //---------------------------------------------------------------------------------------------------


  // productCode: string = '1'; // Example product code

  // generateBarcode() {
  //   const barcodeElement = document.getElementById('barcode');
  //   JsBarcode(barcodeElement, this.productCode, {
  //     format: 'CODE128',
  //     displayValue: true, // Display the code below the barcode
  //     width: 2,
  //     height: 100,
  //   });
  // }



 // scannedCode: string = '';

  // // checkCameraPermissions() {
  // //   navigator.permissions.query({ name: 'camera' as PermissionName }).then((permissionStatus) => {
  // //     if (permissionStatus.state === 'granted') {
  // //       console.log('Camera access granted.');
  // //     } else if (permissionStatus.state === 'denied') {
  // //       console.error('Camera access denied.');
  // //     } else if (permissionStatus.state === 'prompt') {
  // //       console.log('Camera access prompt.');
  // //     }

  // //     permissionStatus.onchange = () => {
  // //       console.log('Permission changed to:', permissionStatus.state);
  // //     };
  // //   });
  // // }

  // permissionError: boolean = false;

  // printBarcode() {
  //   const printContents = document.getElementById('printSection')?.innerHTML;
  //   const originalContents = document.body.innerHTML;

  //   // Create a temporary print window
  //   document.body.innerHTML = printContents || '';

  //   window.print();

  //   // Restore the original contents after printing
  //   document.body.innerHTML = originalContents;
  //   window.location.reload(); // Reload to restore event listeners (if needed)
  // }


 
  // formats: string[] = ['CODE128', 'EAN-13'];
  
  // selectedDevice: MediaDeviceInfo | undefined;


  // onCodeResult(result: string) {
  //   alert();
  //   this.scannedCode = result;
  //   console.log('Scanned Product Code: ', this.scannedCode);
  // }

  // onScanFailure(event: any) {
  //   console.error('Scan failed: ', event);
  // }

  // onCamerasFound(devices: MediaDeviceInfo[]) {
  //   console.log('Cameras found: ', devices);
  //   if (devices && devices.length > 0) {
  //     // Select the first available camera
  //     this.selectedDevice = devices[0];
  //   }
  // }

  // checkCameraPermissions() {
  //   navigator.permissions.query({ name: 'camera' as PermissionName }).then((permissionStatus) => {
  //     if (permissionStatus.state === 'denied') {
  //       this.permissionError = true;
  //     }
  //   });
  // }
}
