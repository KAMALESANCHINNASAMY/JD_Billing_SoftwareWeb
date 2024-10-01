import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
    providedIn: 'root',
})

export class rawProductReturnService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient, private configService: ConfigService) { }

    get(id: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ReturnRawProduct/get_return_raw_product?companyid=' + id + '&return_date=' + date);
    }

    getRawProductBySupplier(id: number, supplierid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ReturnRawProduct/get_raw_product_purchase_by_supplierid?companyid=' + id + '&supplierid=' + supplierid);
    }
    getMaxId(id: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ReturnRawProduct/get_Maxid_return_raw_product_purchase?companyid=' + id);
    }
    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
        return this.http.post<any>(this.apiUrl + 'ReturnRawProduct/Insert_return_raw_product_purchase', value, httpOptions);
    }

    getReturnNested(id: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ReturnRawProduct/get_return_raw_product_nested?returnid=' + id);
    }
}