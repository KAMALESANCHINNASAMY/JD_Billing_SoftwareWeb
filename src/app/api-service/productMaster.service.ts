import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class productMasterService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getList(companyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ProductMaster/get_product_master?companyid=' + companyid);
    }

    newProduct(unitInsert: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'ProductMaster/Insert_product_master', unitInsert, httpOptions);
    }

    delete(productid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'ProductMaster/Delete_product_master?productid=' + productid);
    }
}
