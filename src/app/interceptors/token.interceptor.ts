import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { loginService } from '../api-service/Login/loginService.service';

@Injectable()
export class tokenInterceptor implements HttpInterceptor {

  constructor(private ath: loginService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.ath.getToken();
    if (myToken != null) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${myToken}` } })
    }
    return next.handle(request);
  }
}
