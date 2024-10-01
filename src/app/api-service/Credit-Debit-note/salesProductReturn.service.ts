import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
    providedIn: 'root',
})

export class salesProductReturnService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient, private configService: ConfigService) { }

    get(id: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ReturnSalesProduct/get_return_sales_product?companyid=' + id + '&return_date=' + date);
    }

    getSalesProductByCustomer(id: number, customerid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ReturnSalesProduct/get_sales_product_by_customerid?companyid=' + id + '&customerid=' + customerid);
    }
    getMaxId(id: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ReturnSalesProduct/get_Maxid_return_sales_product?companyid=' + id);
    }
    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
        return this.http.post<any>(this.apiUrl + 'ReturnSalesProduct/Insert_return_sales_product', value, httpOptions);
    }

    getReturnNested(id: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ReturnSalesProduct/get_return_sales_product_nested?returnid=' + id);
    }
}