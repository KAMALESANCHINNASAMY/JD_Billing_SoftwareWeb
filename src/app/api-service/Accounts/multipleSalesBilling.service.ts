import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
    providedIn: 'root',
})
export class multipleSalesBillingService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient, private configService: ConfigService) { }

    // addNew(value: any): Observable<any> {
    //     const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
    //     return this.http.post<any>(this.apiUrl + 'MulitipleSalesBilling/Insert_sales_billing', value, httpOptions);
    // }

    getStockList(id: number,si_code:string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'MulitipleSalesBilling/get_all_stock_table?companyid=' + id+'&si_code='+si_code);
    }
}
