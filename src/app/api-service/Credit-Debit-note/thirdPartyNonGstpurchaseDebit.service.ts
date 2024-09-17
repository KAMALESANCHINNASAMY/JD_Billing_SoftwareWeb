import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
  providedIn: 'root',
})

export class ThirdPartyPurchaseNonGstDebitService {

  readonly apiUrl = this.configService.BSfwUrl;
  constructor(private http: HttpClient, private configService: ConfigService) { }

  getThirdPartyNonGstNestedBySiCode(id: number, si_code: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'ThirdPartyPurchaseNongstDebit/Get_third_party_purchase_nestedBy_si_code?companyid=' + id + '&si_code=' + si_code);
  }

  getThirdPartyNonGstNestedByRefCode(id: number, ref_code: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'ThirdPartyPurchaseNongstDebit/Get_third_party_purchase_nestedBy_ref_code?companyid=' + id + '&ref_code=' + ref_code);
  }

  addNew(value: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
    return this.http.post<any>(this.apiUrl + 'ThirdPartyPurchaseNongstDebit/Insert_third_partyPurchaseNongst_debit', value, httpOptions);
  }

  getThirdPartyNonGstDebitList(id: number, return_date: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'ThirdPartyPurchaseNongstDebit/Get_third_partyPurchaseNongst_debit?companyid=' + id + '&return_date=' + return_date);
  }

  getThirdPartyNonGstDebitNestedList(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'ThirdPartyPurchaseNongstDebit/get_sales_billingNongst_returnDebit_nested?thirdPartyDebitid=' + id);
  }

  getMaxId(id: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'ThirdPartyPurchaseNongstDebit/Get_Maxid_third_partyPurchaseNongst_debit?companyid=' + id
    );
  }

  getNonGSTPurchasebythirdpartyid(id: number, companyid: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'ThirdPartyPurchaseNongstDebit/get_NonGstpurchasebythirdpartyid?third_partyid=' + id + '&companyid=' + companyid);
  }
}
