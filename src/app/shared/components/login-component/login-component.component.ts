import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { loginService } from 'src/app/api-service/Login/loginService.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
    private logSvc: loginService,
    private notificationSvc: NotificationsService,) { }

  ngOnInit(): void {

  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}')]),
    password: new FormControl('')
  });

  login() {
    if (this.loginForm.valid) {
      this.logSvc.addNewCompanyDetail(this.loginForm.value).subscribe((res) => {
        if (res.message == 'Login Success!' && res.token != null && res.userid > 0 && res.companyid > 0) {
          this.loginForm.reset();
          this.logSvc.stroeToken(res);
          this.router.navigateByUrl('/app/dashboard/dashboard');
          this.notificationSvc.success('Login Success');
        }
        else if (res.message == 'User not found!') {
          this.notificationSvc.warn('Invaild Email or Password');
        }
        else {
          this.notificationSvc.error('Contact Admin');
        }
      });
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}
