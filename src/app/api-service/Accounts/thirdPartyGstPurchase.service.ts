import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ConfigService } from "../configuration.service";

@Injectable({
    providedIn: 'root'
})
export class thirdPartyGSTPurchaseService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient,
        private configService: ConfigService) {
    }

    getThirdPartyPurchaseLists(id: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartyGstPurchase/get_third_party_gst_purchase?companyid=' + id + '&date=' + date);
    }

    getThirdPartyPurchaseNestedLists(purchaseid: number): Observable<any[]> {
        debugger
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartyGstPurchase/get_third_party_gst_purchase_nested?purchaseid=' + purchaseid);
    }

    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'ThirdPartyGstPurchase/Insert_third_party_gst_purchase', value, httpOptions);
    }

    delete(purchaseid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'ThirdPartyGstPurchase/delete_third_party_gst_purchase?purchaseid=' + purchaseid);
    }

    //-----
    getMaxId(id: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartyGstPurchase/get_Maxid_third_party_gst_purchase?companyid=' + id);
    }
    //-------
    getThirdPartyPurchaseReport(puchaseid: number): Observable<any[]> {
        return this.http.get<any[]>(
            this.apiUrl +
            'ThirdPartyGstPurchase/get_thirdPartygst_Purchase_report_bill?purchaseid=' +
            puchaseid
        );
    }
}
