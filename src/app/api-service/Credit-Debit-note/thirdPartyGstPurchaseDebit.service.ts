import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
  providedIn: 'root',
})

export class ThirdPartyPurchaseGstDebitService {

  readonly apiUrl = this.configService.BSfwUrl;
  constructor(private http: HttpClient, private configService: ConfigService) { }

  getThirdPartyGstNestedBySiCode(id: number, si_code: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'ThirdPartyGstDebit/Get_ThirdPartyPurchasegst_nestedBy_Si_code?companyid=' + id + '&si_code=' + si_code);
  }

  getThirdPartyGstNestedByRefCode(id: number, ref_code: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'ThirdPartyGstDebit/Get_ThirdPartyPurchasegst_nestedBy_ref_code?companyid=' + id + '&ref_code=' + ref_code);
  }

  addNew(value: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
    return this.http.post<any>(this.apiUrl + 'ThirdPartyGstDebit/Insert_third_partyPurchasegst_debit', value, httpOptions);
  }

  getThirdPartyGstDebitList(id: number, return_date: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'ThirdPartyGstDebit/get_third_partyPurchasegst_debit?companyid=' + id + '&return_date=' + return_date);
  }

  getThirdPartyGstDebitNestedList(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'ThirdPartyGstDebit/get_third_partyPurchasegst_debit_nested?thirdPartyDebitid=' + id);
  }

  getMaxId(id: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'ThirdPartyGstDebit/Get_Maxid_third_partyPurchasegst_debit?companyid=' + id
    );
  }

  getBillNo(id: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'ThirdPartyGstDebit/get_thirdparty_purchase_bythirdpartyid?third_partyid=' + id + '&companyid=' + companyid);
  }
}
