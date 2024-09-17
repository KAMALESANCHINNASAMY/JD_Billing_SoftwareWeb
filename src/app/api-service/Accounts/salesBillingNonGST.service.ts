import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
  providedIn: 'root',
})

export class salesBillingServiceNonGST {

  readonly apiUrl = this.configService.BSfwUrl;
  constructor(private http: HttpClient, private configService: ConfigService) { }

  addNew(value: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
    return this.http.post<any>(this.apiUrl + 'SalesBillingNonGST/Insert_sales_billing_nongst', value, httpOptions);
  }

  getMaxId(id: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBillingNonGST/Get_Maxid_sales_billing_nongst?companyid=' + id);
  }

  getSalesNonGSTList(id: any, date: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBillingNonGST/get_sales_billing_nongst?companyid=' + id + '&date=' + date);
  }

  getSalesNonGSTNestedList(entryid: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBillingNonGST/get_sales_billing_nested_nongst?entryid=' + entryid);
  }

  getMultipleSalesReport(entryid: number): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl +
      'MulitipleSalesBilling/get_multiple_salesNongst_report?entryid=' +
      entryid
    );
  }

  delete(entryid: any): Observable<any> {
    return this.http.delete<any>(this.apiUrl + 'SalesBillingNonGST/delete_sales_billing_nongst?entryid=' + entryid);
  }

}
