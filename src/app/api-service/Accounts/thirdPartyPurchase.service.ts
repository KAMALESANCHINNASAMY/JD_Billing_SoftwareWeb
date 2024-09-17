import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ConfigService } from "../configuration.service";

@Injectable({
    providedIn: 'root'
})
export class thirdPartyPurchaseService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient,
        private configService: ConfigService) {
    }

    getThirdPartyPurchaseLists(id: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartyPurchase/get_third_party_purchase?companyid=' + id + '&date=' + date);
    }

    getThirdPartyPurchaseNestedLists(purchaseid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartyPurchase/get_third_party_purchase_nested?purchaseid=' + purchaseid);
    }

    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'ThirdPartyPurchase/Insert_third_party_purchase', value, httpOptions);
    }

    getMaxId(id: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartyPurchase/get_Maxid_third_party_purchase?companyid=' + id);
    }

    delete(purchaseid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'ThirdPartyPurchase/delete_third_party_purchase?purchaseid=' + purchaseid);
    }

    getThirdPartySICode(id: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartyPurchase/get_SiCode_third_party_purchase?companyid=' + id);
    }

    getThirdPartyRefCode(id: any, partyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartyPurchase/get_RefCode_third_party_purchase?companyid=' + id + '&third_partyid=' + partyid);
    }
    getThirdPartyPurchaseReport(puchaseid: number): Observable<any[]> {
        return this.http.get<any[]>(
            this.apiUrl +
            'ThirdPartyPurchase/get_thirdPartyNongst_Purchase_report_bill?purchaseid=' +
            puchaseid
        );
    }
}
