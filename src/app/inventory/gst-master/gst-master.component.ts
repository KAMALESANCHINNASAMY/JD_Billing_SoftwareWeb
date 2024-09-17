import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { NotificationsService } from 'angular2-notifications';
import { gstMasterService } from 'src/app/api-service/gstMaster.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gst-master',
  templateUrl: './gst-master.component.html',
  styleUrl: './gst-master.component.scss',
})
export class GstMasterComponent implements OnInit {
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  gstMasterList: any[] = [];
  MaxId: any = [];

  constructor(
    private router: Router,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private GSTMSVC: gstMasterService
  ) { }

  ngOnInit() {
    this.getGstMasterDetails();
    this.getMaxId();
  }

  gstMasterDetails = new FormGroup({
    gstid: new FormControl(0),
    companyid: new FormControl(this.companyID),
    gst_ID: new FormControl(''),
    gst_percentage: new FormControl(''),
    igst_percentage: new FormControl(''),
    c_gst: new FormControl(''),
    s_gst: new FormControl(''),
    cuid: new FormControl(this.userID),
  });

  calculateGST() {
    this.gstMasterDetails.get('c_gst')?.setValue(String(Number(this.gstMasterDetails.value.gst_percentage) / 2));
    this.gstMasterDetails.get('s_gst')?.setValue(String(Number(this.gstMasterDetails.value.gst_percentage) / 2));
    this.gstMasterDetails.get('igst_percentage')?.setValue(String(this.gstMasterDetails.value.gst_percentage));
  }

  getGstMasterDetails() {
    this.GSTMSVC.getGstMaster(this.companyID).subscribe((res) => {
      this.gstMasterList = res;
    });
  }

  getMaxId() {
    this.GSTMSVC.getMaxID(this.companyID).subscribe((res) => {
      this.MaxId = res;
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

  preventPasteNumber(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    if (/[a-zA-Z]/.test(pastedText)) {
      event.preventDefault();
      this.notificationSvc.warn('Only numbers are allowed in this field');
    }
  }
  save() {
    if (this.gstMasterDetails.valid) {
      if (this.gstMasterDetails.value.gstid == 0) {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to add this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var gstInsert = this.gstMasterDetails.value;
              let gstid: number = this.MaxId[0].gstid;
              let gstID: string;

              if (gstid < 10) {
                gstID = '00' + gstid;
              } else if (gstid < 100) {
                gstID = '0' + gstid;
              } else {
                gstID = gstid.toString();
              }
              gstInsert.gst_ID = gstID;
              this.GSTMSVC.newGstMasterIns(gstInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                  this.getMaxId();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('GST Percentage already exists! Use a different GST Percentage');
                }
                else {
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
              var gstInsert = this.gstMasterDetails.value;
              this.GSTMSVC.newGstMasterIns(gstInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved successfully');
                  this.cancelClick();
                  this.getMaxId();
                }
                else if (res.status == 'Alredy') {
                  this.notificationSvc.warn('GST Percentage already exists! Use a different GST Percentage');
                }
                else {
                  this.notificationSvc.error('Something Error');
                }
              });
            }
          });
      }
    } else {
      this.gstMasterDetails.markAllAsTouched();
    }
  }

  updateGetClick(value: any) {
    this.gstMasterDetails.patchValue(value);
    this.gstMasterDetails.get('companyid')?.setValue(this.companyID);
    this.gstMasterDetails.get('cuid')?.setValue(this.userID);
    this.scrollToTableTop();
  }

  deleteClick(gstid: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.GSTMSVC.deleteGstMaster(gstid).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
              this.getMaxId();
              this.getGstMasterDetails();
            }
          });
        }
      });
  }

  cancelClick() {
    this.gstMasterDetails.reset();
    this.getGstMasterDetails();

    this.gstMasterDetails.get('companyid')?.setValue(this.companyID);
    this.gstMasterDetails.get('gstid')?.setValue(0);
    this.gstMasterDetails.get('gst_ID')?.setValue('');
    this.gstMasterDetails.get('gst_percentage')?.setValue('');
    this.gstMasterDetails.get('igst_percentage')?.setValue('');
    this.gstMasterDetails.get('c_gst')?.setValue('');
    this.gstMasterDetails.get('s_gst')?.setValue('');
    this.gstMasterDetails.get('cuid')?.setValue(this.userID);
  }

  backButton() {
    this.router.navigateByUrl('/app/dashboard/dashboard');
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
