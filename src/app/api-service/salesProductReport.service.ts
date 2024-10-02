import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class salesProductReportService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    saleRawProductList(companyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SalesProductReports/get_sales_product_report?companyid=' + companyid);
    }

}
