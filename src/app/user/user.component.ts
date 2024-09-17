import { companyDetailsService } from 'src/app/api-service/companyMaster.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogService } from '../api-service/Dialog.service';
import { NotificationsService } from 'angular2-notifications';
import { Validators } from '@angular/forms';
import { userProfileService } from '../api-service/userProfile.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  companyDetailsList: any[] = [];
  userID: number = Number(localStorage.getItem('userid'));
  companyID: number = Number(localStorage.getItem('companyid'));
  UsersList: any = [];
  files: File[] = [];
  editableImage: any;
  file: any;
  base64textString: any[] = [];
  menus: any;

  constructor(
    private CDSVC: companyDetailsService,
    private DialogSvc: DialogService,
    private notificationSvc: NotificationsService,
    private userSvc: userProfileService,
    private lSvc: LayoutComponent
  ) { }

  ngOnInit() {
    this.getCompanyDetails();
    this.refreshsUsersList();
    this.menus = this.lSvc.menuSidebar;
  }

  refreshsUsersList() {
    this.userSvc.getUsersList(this.companyID).subscribe((data) => {
      this.UsersList = data;
    });
  }

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
      this.companyDetailsList.forEach((e) => {
        e['isselect'] = false;
      });
    });
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
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
    this.userProfileForm.get('img')?.setValue('');
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
    this.userProfileForm.get('img')?.setValue(this.base64textString[0]);
  }

  userProfileForm = new FormGroup({
    userid: new FormControl(0),
    user_name: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),
    ]),
    password: new FormControl(''),
    confirm_password: new FormControl(''),
    m_companyid: new FormControl(this.companyID),
    s_companyid: new FormControl('', Validators.required),
    img: new FormControl(''),
    cuid: new FormControl(this.userID),
    companyid: new FormControl(this.companyID),
    main_menu: new FormControl([]),
    sub_menu: new FormControl([])
  });

  newUserProfile() {
    const mainMenuWithSelect: any = [];
    const subMenuWithSelect: any = [];

    this.menus.forEach((menu: any) => {
      if (menu.isselect) {
        mainMenuWithSelect.push(String(menu.value));
      }

      menu.sub_menu.forEach((submenu: any) => {
        if (submenu.isselect) {
          subMenuWithSelect.push(String(submenu.value));
        }
      });
    });

    this.userProfileForm.get('main_menu')?.setValue(mainMenuWithSelect);
    this.userProfileForm.get('sub_menu')?.setValue(subMenuWithSelect);
    let newA = this.companyDetailsList.filter((e) => { return e.isselect }).map((company) => company.companyid).join(',');

    this.userProfileForm.get('s_companyid')?.setValue(newA);
    if (!newA) {
      this.notificationSvc.warn('Select atleast one company');
      return;
    }
    if (this.userProfileForm.valid) {
      if (
        this.userProfileForm.value.password !=
        this.userProfileForm.value.confirm_password
      ) {
        this.notificationSvc.warn('Invalid confirm Password');
        return;
      }
      if (this.userProfileForm.value.userid == 0) {
        this.DialogSvc.openConfirmDialog(
          'Are you sure want to add this record ?'
        )
          .afterClosed()
          .subscribe((res) => {
            if (res == true) {
              var userInsert = this.userProfileForm.value;
              this.userSvc.newUserProfile(userInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                } else if (res.status == 'User Already exists') {
                  this.notificationSvc.warn('Email already Exists');
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
              var userInsert = this.userProfileForm.value;
              this.userSvc.newUserProfile(userInsert).subscribe((res) => {
                if (res.status == 'Saved successfully') {
                  this.notificationSvc.success('Saved Success');
                  this.cancelClick();
                }
                else if (res.status == 'User Already exists') {
                  this.notificationSvc.warn('Email already Exists');
                }
                else {
                  this.notificationSvc.error('Something error');
                }
              });
            }
          });
      }
    } else {
      this.userProfileForm.markAllAsTouched();
    }
  }

  deleteClick(userid: number) {
    this.DialogSvc.openConfirmDialog('Are you sure want to delete this record?')
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.userSvc.deleteuser(userid).subscribe((res) => {
            if (res?.recordid) {
              this.notificationSvc.error('Deleted Success');
              this.getCompanyDetails();
              this.refreshsUsersList();
              this.cancelClick();
            }
          });
        }
      });
  }

  updateGetClick(user: any) {
    this.menus = this.lSvc.menuSidebar;
    this.userProfileForm.get('userid')?.setValue(user.userid);
    this.userProfileForm.get('companyid')?.setValue(this.companyID);
    this.userProfileForm.get('user_name')?.setValue(user.user_name);
    this.userProfileForm.get('phone')?.setValue(user.phone);
    this.userProfileForm.get('email')?.setValue(user.email);
    this.userProfileForm.get('password')?.setValue(user.password);
    this.userProfileForm.get('confirm_password')?.setValue(user.confirm_password);
    this.userProfileForm.get('m_companyid')?.setValue(user.m_companyid);
    this.userProfileForm.get('img')?.setValue(user.img);
    this.editableImage = user.img;
    this.userProfileForm.get('cuid')?.setValue(this.userID);
    let s_ComPany = user.s_companyid.split(',').map(Number);
    this.companyDetailsList.forEach((e) => {
      let found = s_ComPany.filter((ee: any) => {
        return ee == e.companyid;
      });
      if (found.length > 0) {
        e.isselect = true;
      } else {
        e.isselect = false;
      }
    });

    const updatedMenu = this.lSvc.menuSidebar.map(menu => {
      const isSelected = user.main_menus.includes(menu.value);
      const updatedSubMenu = menu.sub_menu.map((submenu: any) => {
        return { ...submenu, isselect: user.sub_menus.includes(submenu.value) };
      });

      return { ...menu, isselect: isSelected, sub_menu: updatedSubMenu };
    });
    this.menus = updatedMenu

    this.scrollToTableTop();
  }

  cancelClick() {
    this.menus = this.lSvc.menuSidebar;
    this.userProfileForm.reset();
    this.userProfileForm.get('userid')?.setValue(0);
    this.userProfileForm.get('companyid')?.setValue(this.companyID);
    this.userProfileForm.get('user_name')?.setValue('');
    this.userProfileForm.get('phone')?.setValue('');
    this.userProfileForm.get('email')?.setValue('');
    this.userProfileForm.get('password')?.setValue('');
    this.userProfileForm.get('confirm_password')?.setValue('');
    this.userProfileForm.get('s_companyid')?.setValue('');
    this.userProfileForm.get('companyid')?.setValue(this.companyID);
    this.userProfileForm.get('m_companyid')?.setValue(this.companyID);
    this.userProfileForm.get('img')?.setValue('');
    this.userProfileForm.get('cuid')?.setValue(this.userID);
    this.editableImage = '';
    this.files = [];

    this.getCompanyDetails();
    this.refreshsUsersList();
  }

  @ViewChild('tableTop') tableTop!: ElementRef;
  scrollToTableTop() {
    this.tableTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleSubMenu(mainMenu: any) {
    for (const subMenu of mainMenu.sub_menu) {
      subMenu.isselect = mainMenu.isselect;
    }
  }
}
