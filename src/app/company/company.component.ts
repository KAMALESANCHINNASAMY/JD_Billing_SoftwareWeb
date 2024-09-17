import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from 'src/app/api-service/Dialog.service';
import { companyDetailsService } from 'src/app/api-service/companyMaster.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {

  userID: number = Number(localStorage.getItem('userid'));
  files: File[] = [];
  editableImage: any;
  file: any;
  base64textString: any[] = [];
  companyDetailsList: any[] = [];

  constructor(
    private router: Router,
    private CDSVC: companyDetailsService,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService
  ) { }

  ngOnInit(): void {
    this.getCompanyDetails();
  }
  companyDetails = new FormGroup({
    companyid: new FormControl(0),
    company_sdate: new FormControl(''),
    company_name: new FormControl(''),
    display_name: new FormControl(''),
    door_no: new FormControl(''),
    building_name: new FormControl(''),
    street_name: new FormControl(''),
    streent_name1: new FormControl(''),
    email: new FormControl(''),
    c_location: new FormControl(''),
    pincode: new FormControl(''),
    post: new FormControl(''),
    taluk: new FormControl(''),
    district: new FormControl(''),
    website: new FormControl(''),
    owner_name: new FormControl(''),
    mobile: new FormControl(''),
    office_phno: new FormControl(''),
    logo: new FormControl(''),
    bank_name: new FormControl(''),
    ac_holder_name: new FormControl(''),
    ac_no: new FormControl(''),
    ifsc_code: new FormControl(''),
    gst_in: new FormControl(''),
    cuid: new FormControl(this.userID)
  });

  stringOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return false;
    }

    return true;
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const inputValue = event.target.value;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    if (inputValue.length >= 10) {
      return false;
    }

    return true;
  }

  numberOnlyPincode(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const inputValue = event.target.value;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    if (inputValue.length === 6) {
      return false;
    }

    return true;
  }
  preventPasteString(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    if (/\d/.test(pastedText)) {
      event.preventDefault();
      this.notificationSvc.warn('Numbers are not allowed in this field');
    }
  }

  preventPasteNumber(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    if (/[a-zA-Z]/.test(pastedText)) {
      event.preventDefault();
      this.notificationSvc.warn('Only numbers are allowed in this field');
    }
  }
  getCompanyDetails() {
    this.CDSVC.getList().subscribe((res) => {
      this.companyDetailsList = res;
    });
  }

  save() {
    if (this.companyDetails.valid) {
      if (this.companyDetails.value.companyid == 0) {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to add this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var companyInsert = this.companyDetails.value;
              this.CDSVC.addNewCompanyDetail(companyInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                  this.getCompanyDetails();
                } else if (res.status == 'Company Already Exists') {
                  this.notificationSvc.warn('Company Already Exists');
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
              var companyInsert = this.companyDetails.value;
              this.CDSVC.addNewCompanyDetail(companyInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                  this.getCompanyDetails();
                } else {
                  this.notificationSvc.error('Something Error');
                }
              });
            }
          });
      }
    } else {
      this.companyDetails.markAllAsTouched();
      this.notificationSvc.error('Some required input are missing!')
    }
  }

  cancelClick() {
    this.companyDetails.reset();
    this.getCompanyDetails();
    this.editableImage = '';
    this.files = [];

    this.companyDetails.get('companyid')?.setValue(0);
    this.companyDetails.get('company_name')?.setValue('');
    this.companyDetails.get('display_name')?.setValue('');
    this.companyDetails.get('door_no')?.setValue('');
    this.companyDetails.get('building_name')?.setValue('');
    this.companyDetails.get('street_name')?.setValue('');
    this.companyDetails.get('streent_name1')?.setValue('');
    this.companyDetails.get('email')?.setValue('');
    this.companyDetails.get('c_location')?.setValue('');
    this.companyDetails.get('pincode')?.setValue('');
    this.companyDetails.get('post')?.setValue('');
    this.companyDetails.get('taluk')?.setValue('');
    this.companyDetails.get('district')?.setValue('');
    this.companyDetails.get('website')?.setValue('');
    this.companyDetails.get('owner_name')?.setValue('');
    this.companyDetails.get('mobile')?.setValue('');
    this.companyDetails.get('office_phno')?.setValue('');
    this.companyDetails.get('logo')?.setValue('');
    this.companyDetails.get('bank_name')?.setValue('');
    this.companyDetails.get('ac_holder_name')?.setValue('');
    this.companyDetails.get('ac_no')?.setValue('');
    this.companyDetails.get('ifsc_code')?.setValue('');
    this.companyDetails.get('gst_in')?.setValue('');
    this.companyDetails.get('company_sdate')?.setValue('');
    this.companyDetails.get('cuid')?.setValue(this.userID);
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);

    // this.files.push(...event.addedFiles);
    if (this.files.length > 1) {
      // checking if files array has more than one content
      this.replaceFile(); // replace file
    }
    this.convertFileToBase64AndSet(event.addedFiles[0]);
    const formData = new FormData();

    for (var i = 0; i < this.files.length; i++) {
      formData.append('file[]', this.files[0]);
      this.file = this.files[0];
    }
  }
  replaceFile() {
    this.files.splice(0, 1); // index =0 , remove_count = 1
  }
  deleteImage() {
    this.files = [];
    this.editableImage = null;
    this.base64textString = [];
    this.companyDetails.get('logo')?.setValue('');
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  convertFileToBase64AndSet(fileList: any) {
    this.base64textString = [];
    if (fileList) {
      var reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(fileList);
    }
  }

  handleReaderLoaded(e: any) {
    this.base64textString.push(
      'data:image/png;base64,' + btoa(e.target.result)
    );
    this.companyDetails.get('logo')?.setValue(this.base64textString[0]);
  }
  deleteClick(companyid: number) {
    this.DialogSvc.openConfirmDialog(
      'Are you sure want to delete this record ?'
    )
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.CDSVC.delete(companyid).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.cancelClick();
            }
          });
        }
      });
  }

  UpdateGetClick(value: any) {
    this.companyDetails.patchValue(value);
    this.editableImage = value.logo;
    this.companyDetails.get('cuid')?.setValue(this.userID);
    this.scrollToTableTop();
  }

  ActiveStatusClick(companyid: any) {
    this.CDSVC.setActiveStsCompany(companyid).subscribe((res) => {
      if (res?.recordid) {
        this.cancelClick();
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
