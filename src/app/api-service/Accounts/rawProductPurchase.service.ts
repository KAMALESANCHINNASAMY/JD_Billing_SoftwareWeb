import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ConfigService } from "../configuration.service";

@Injectable({
    providedIn: 'root'
})
export class rawProductPurchaseService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient,
        private configService: ConfigService) {
    }

    getRawProductLists(id: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'RawProductPurchase/get_raw_product_purchase?companyid=' + id + '&date=' + date);
    }

    getRawProductNestedLists(purchaseid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'RawProductPurchase/get_raw_product_purchase_nested?purchaseid=' + purchaseid);
    }

    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'RawProductPurchase/Insert_raw_product_purchase', value, httpOptions);
    }

    getMaxId(id: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'RawProductPurchase/get_Maxid_raw_product_purchase?companyid=' + id);
    }

    delete(purchaseid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'RawProductPurchase/Delete_raw_product_purchase?purchaseid=' + purchaseid);
    }
}
