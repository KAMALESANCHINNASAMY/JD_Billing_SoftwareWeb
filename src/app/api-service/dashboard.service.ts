import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class dashBoardService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getListGst(date: any, companyid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SalesReports/get_customer_payment_reminder?date=' + date + '&companyid=' + companyid);
    }

    getListNonGst(date: any, companyid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SalesReports/get_customer_payment_nongst_reminder?date=' + date + '&companyid=' + companyid);
    }
}
