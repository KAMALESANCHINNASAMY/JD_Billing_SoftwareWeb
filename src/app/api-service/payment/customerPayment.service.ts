import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ConfigService } from "../configuration.service";

@Injectable({
    providedIn: 'root'
})
export class customerPaymentService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient,
        private configService: ConfigService) {
    }

    getCustomerPaymentLists(id: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'CustomerPayment/get_customer_Payment_details?customerid=' + id);
    }

    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
        return this.http.post<any>(this.apiUrl + 'CustomerPayment/Insert_customer_payment', value, httpOptions);
    }

    getPayment(fromdate: any, todate: any, customerid: any, companyid: any): Observable<any[]> {
        return this.http.get<any[]>(
            this.apiUrl + 'CustomerPayment/get_customer_payment?fromdate=' + fromdate + '&todate=' + todate + '&customerid=' + customerid + '&companyid=' + companyid
        )
    };

    delete(paymentid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'CustomerPayment/delete_customer_payment?paymentid=' + paymentid);
    }
}
