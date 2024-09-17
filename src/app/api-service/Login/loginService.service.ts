import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
    providedIn: 'root',
})
export class loginService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    CheckUser(email: any, password: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'UserLogin/Authenticate/authenticate?email=' + email + '&password=' + password)
    }

    addNewCompanyDetail(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post(this.apiUrl + 'UserLogin/Authenticate/authenticate', value, httpOptions);
    }

    stroeToken(res: any) {
        localStorage.setItem('token', res.token);
        localStorage.setItem("companyid", String(res.companyid));
        localStorage.setItem("userid", String(res.userid));
    }

    getToken() {
        return localStorage.getItem('token')
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }
}