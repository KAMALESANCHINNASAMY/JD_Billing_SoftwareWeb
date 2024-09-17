import { Injectable } from '@angular/core';
import { CanActivate, Router, } from '@angular/router';

import { NotificationsService } from 'angular2-notifications';
import { loginService } from '../api-service/Login/loginService.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private loginSvc: loginService,
    private router: Router,
    private notificationSvc: NotificationsService
  ) { }
  canActivate(): boolean {
    if (this.loginSvc.isLoggedIn()) {
      return true;
    }
    else {
      this.notificationSvc.error("Please Login first!")
      this.router.navigate(['/login']);
      // use any one route
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}