import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
    providedIn: 'root',
})

export class purchaseFromThirdPartyReturnService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient, private configService: ConfigService) { }

    get(id: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'PurchaseFromThirdPartyReturn/get_return_purchase_from_thirdparty?companyid=' + id + '&return_date=' + date);
    }

    getSalesProductByCustomer(id: number, third_partyid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'PurchaseFromThirdPartyReturn/get_purchase_from_thirdpartybyid?companyid=' + id + '&third_partyid=' + third_partyid);
    }
    getMaxId(id: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'PurchaseFromThirdPartyReturn/get_Maxid_return_purchase_from_thirdparty?companyid=' + id);
    }
    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
        return this.http.post<any>(this.apiUrl + 'PurchaseFromThirdPartyReturn/Insert_return_purchase_from_thirdparty', value, httpOptions);
    }

    getReturnNested(id: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'PurchaseFromThirdPartyReturn/get_return_purchase_from_thirdparty_nested?returnid=' + id);
    }
}