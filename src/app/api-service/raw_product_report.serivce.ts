import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class rawProductReportService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getRawProductStockList(companyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'RawProductReport/get_stock_by_raw_product?companyid=' + companyid);
    }

}
