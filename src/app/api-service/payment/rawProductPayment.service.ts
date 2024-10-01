import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ConfigService } from "../configuration.service";

@Injectable({
    providedIn: 'root'
})

export class rawProductPaymentService {

    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient,
        private configService: ConfigService) {
    }

    getPaymentsLists(id: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'RawProductPayment/get_raw_product_payment_details?supplierid=' + id);
    }

    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
        return this.http.post<any>(this.apiUrl + 'RawProductPayment/Insert_raw_product_payment', value, httpOptions);
    }
}
