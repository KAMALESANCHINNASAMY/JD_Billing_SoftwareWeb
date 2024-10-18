import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class dayBookReportService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    saleList(companyid: any, fromdate: any, todate: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'DayBook/get_daybook_bydate?companyid=' + companyid + '&fromdate=' + fromdate + '&todate=' + todate);
    }

}
