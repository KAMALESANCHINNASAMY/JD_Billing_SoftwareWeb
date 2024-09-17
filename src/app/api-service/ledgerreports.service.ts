import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class LedgerReportsService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getSales(id: any, fromdate: any, todate: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'Ledger/get_sales_legger?customerid=' + id + '&fromdate=' + fromdate + '&todate=' + todate);
    }

    getSalesNonGst(id: any, fromdate: any, todate: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'Ledger/get_sales_legger_non_gst?customerid=' + id + '&fromdate=' + fromdate + '&todate=' + todate);
    }

    getSupplier(id: any, fromdate: any, todate: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'Ledger/get_supplier_legger?supplierid=' + id + '&fromdate=' + fromdate + '&todate=' + todate);
    }

    getThirdPartyGst(id: any, fromdate: any, todate: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'Ledger/get_third_party_gst_legger?third_partyid=' + id + '&fromdate=' + fromdate + '&todate=' + todate);
    }

    getThirdPartyNonGst(id: any, fromdate: any, todate: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'Ledger/get_third_party_nongst_ledger?third_partyid=' + id + '&fromdate=' + fromdate + '&todate=' + todate);
    }
}
