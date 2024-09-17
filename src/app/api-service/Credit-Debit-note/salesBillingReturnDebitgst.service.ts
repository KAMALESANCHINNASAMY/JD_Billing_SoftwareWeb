import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
  providedIn: 'root',
})

export class salesBillingReturnService {

  readonly apiUrl = this.configService.BSfwUrl;
  constructor(private http: HttpClient, private configService: ConfigService) { }

  getSalesBillingNestedBySiCode(id: number, si_code: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBillReturn/Get_salesBilling_sbnestedBy_si_code?companyid=' + id + '&si_code=' + si_code);
  }

  getSalesBillingNestedByRefCode(id: number, ref_code: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBillReturn/Get_salesBilling_sbnestedBy_ref_code?companyid=' + id + '&ref_code=' + ref_code);
  }

  addNew(value: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
    return this.http.post<any>(this.apiUrl + 'SalesBillReturn/Insert_sales_billing_returnDebit', value, httpOptions);
  }

  getSalesBillingDebitList(id: number, return_date: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBillReturn/Get_sales_billing_returnDebit?companyid=' + id + '&return_date=' + return_date);
  }

  getSalesBillingDebitNestedList(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBillReturn/get_sales_billing_returnDebit_nested?returndebit_id=' + id);
  }

  getMaxId(id: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'SalesBillReturn/Get_Maxid_return_sales_billing_gst?companyid=' + id
    );
  }

  getSalesBillingByCustomerID(id: number, companyid: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBillReturn/get_salesbilling_gst_bycustomerid?customerid=' + id + '&companyid=' + companyid);
  }

}
