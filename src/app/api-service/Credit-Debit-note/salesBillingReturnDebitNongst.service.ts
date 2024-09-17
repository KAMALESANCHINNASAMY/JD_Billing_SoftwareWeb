import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
  providedIn: 'root',
})

export class salesBillingReturnDebitNonGstService {

  readonly apiUrl = this.configService.BSfwUrl;
  constructor(private http: HttpClient, private configService: ConfigService) { }

  getSalesBillingNongstNestedBySiCode(id: number, si_code: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBillReturnNonGSTDebit/Get_salesBillingNongst_sbnestedBy__si_code?companyid=' + id + '&si_code=' + si_code);
  }

  getSalesBillingNongstNestedByRefCode(id: number, ref_code: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBillReturnNonGSTDebit/Get_salesBillingNongst_sbnestedBy_ref_code?companyid=' + id + '&ref_code=' + ref_code);
  }

  addNew(value: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
    return this.http.post<any>(this.apiUrl + 'SalesBillReturnNonGSTDebit/Insert_sales_billingNongst_returnDebit', value, httpOptions);
  }

  getSalesBillingNongstDebitList(id: number, return_date: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBillReturnNonGSTDebit/Get_sales_billingNongst_returnDebit?companyid=' + id + '&return_date=' + return_date);
  }

  getSalesBillingNongstDebitNestedList(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBillReturnNonGSTDebit/get_sales_billingNongst_returnDebit_nested?returndebit_id=' + id);
  }

  getMaxId(id: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'SalesBillReturnNonGSTDebit/Get_Maxid_return_sales_billingNongst_returnDebit?companyid=' + id
    );
  }

  getSalesBillingByCustomerID(id: number, companyid: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBillReturnNonGSTDebit/get_salesbilling_Nongst_bycustomerid?customerid=' + id + '&companyid=' + companyid);
  }
}
