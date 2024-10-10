import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ConfigService } from "../configuration.service";

@Injectable({
    providedIn: 'root'
})

export class purchaseFromThirdPartyPaymentService {

    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient,
        private configService: ConfigService) {
    }

    getPaymentsLists(id: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'purchaseFromThirdPartyPayment/get_purchase_from_thirdparty_payment_details?third_partyid=' + id);
    }

    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
        return this.http.post<any>(this.apiUrl + 'purchaseFromThirdPartyPayment/Insert_purchase_from_thirdparty_payment', value, httpOptions);
    }
}
