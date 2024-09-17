import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ConfigService } from "../configuration.service";

@Injectable({
  providedIn: 'root'
})

export class thirdPartyPaymentService {

  readonly apiUrl = this.configService.BSfwUrl;
  constructor(private http: HttpClient,
    private configService: ConfigService) {
  }

  getThirdPartyPaymentLists(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'ThirdPartyPayment/get_thirdparty_Payment_details?third_partyid=' + id);
  }

  addNew(value: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
    return this.http.post<any>(this.apiUrl + 'ThirdPartyPayment/Insert_thirdparty_payment', value, httpOptions);
  }

  getPayment(fromdate: any, todate: any, third_partyid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'ThirdPartyPayment/get_thirdparty_payment?fromdate=' + fromdate + '&todate=' + todate + '&third_partyid=' + third_partyid + '&companyid=' + companyid
    )
  };

  delete(paymentid: any): Observable<any> {
    return this.http.delete<any>(this.apiUrl + 'ThirdPartyPayment/delete_thirdparty_payment?paymentid=' + paymentid);
  }
}
