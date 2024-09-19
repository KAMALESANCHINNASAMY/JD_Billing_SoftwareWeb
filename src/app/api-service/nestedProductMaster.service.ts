import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class nestedProductMasterService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getList(companyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'NestedProductMaster/get_nested_product_master?companyid=' + companyid);
    }

    newNProduct(unitInsert: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'NestedProductMaster/Insert_nested_product_master', unitInsert, httpOptions);
    }

    delete(n_productid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'NestedProductMaster/Delete_nested_product_master?n_productid=' + n_productid);
    }
}
