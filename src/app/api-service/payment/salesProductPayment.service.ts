import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ConfigService } from "../configuration.service";

@Injectable({
    providedIn: 'root'
})

export class salesProductPaymentService {

    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient,
        private configService: ConfigService) {
    }

    getPaymentsLists(id: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SalesProductPayment/get_sales_product_payment_details?customerid=' + id);
    }

    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
        return this.http.post<any>(this.apiUrl + 'SalesProductPayment/Insert_sales_product_payment', value, httpOptions);
    }
}
