import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ConfigService } from "../configuration.service";

@Injectable({
    providedIn: 'root'
})
export class purchaseFromThirdPartyService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient,
        private configService: ConfigService) {
    }

    getSalesLists(id: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'PurchaseFromThirdParty/get_purchase_from_thirdparty?companyid=' + id + '&date=' + date);
    }

    getSalesNestedLists(purchaseid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'PurchaseFromThirdParty/get_purchase_from_thirdparty_nested?purchaseid=' + purchaseid);
    }

    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'PurchaseFromThirdParty/Insert_purchase_from_thirdparty', value, httpOptions);
    }

    getMaxId(id: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'PurchaseFromThirdParty/get_Maxid_purchase_from_thirdparty?companyid=' + id);
    }

    delete(purchaseid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'PurchaseFromThirdParty/Delete_purchase_from_thirdparty?purchaseid=' + purchaseid);
    }
}
