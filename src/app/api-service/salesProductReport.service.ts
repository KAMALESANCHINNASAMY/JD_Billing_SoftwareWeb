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

    saleList(companyid: any, customerid: any, fromdate: any, todate: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SalesProductReports/get_sales_product_report?companyid=' + companyid + '&customerid=' + customerid + '&fromdate=' + fromdate + '&todate=' + todate);
    }

    getPayment(fromdate: any, todate: any, customerid: any, companyid: any): Observable<any[]> {
        return this.http.get<any[]>(
            this.apiUrl + 'SalesProductReports/get_sales_product_payment?fromdate=' + fromdate + '&todate=' + todate + '&customerid=' + customerid + '&companyid=' + companyid
        )
    }

    delete(paymentid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'SalesProductReports/delete_sales_product_payment?paymentid=' + paymentid);
    }

    getSalesLed(id: any, fromdate: any, todate: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SalesProductReports/get_sales_product_legger?customerid=' + id + '&fromdate=' + fromdate + '&todate=' + todate);
    }
}
