import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class linkProductMasterService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getList(companyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'LinkProduct/get_link_product?companyid=' + companyid);
    }

    getNestedList(linkid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'LinkProduct/get_link_product_nested?linkid=' + linkid);
    }

    newLinkProduct(unitInsert: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'LinkProduct/Insert_link_product', unitInsert, httpOptions);
    }

    delete(linkid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'LinkProduct/delete_link_product?linkid=' + linkid);
    }
}
