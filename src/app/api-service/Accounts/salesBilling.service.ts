import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
  providedIn: 'root',
})
export class salesBillingService {
  readonly apiUrl = this.configService.BSfwUrl;
  constructor(private http: HttpClient, private configService: ConfigService) { }

  addNew(value: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<any>(
      this.apiUrl + 'SalesBilling/Insert_sales_billing',
      value,
      httpOptions
    );
  }

  // getStockList(id: number, ref_code: string): Observable<any[]> {
  //   return this.http.get<any[]>(
  //     this.apiUrl +
  //     'SalesBilling/get_stock_table_by_refcode?companyid=' +
  //     id +
  //     '&ref_code=' +
  //     ref_code
  //   );
  // }

  getStockListBySi_code(id: number, si_code: string): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl +
      'SalesBilling/get_stock_table_by_SiCode?companyid=' +
      id +
      '&si_code=' +
      si_code
    );
  }

  getMaxId(id: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'SalesBilling/Get_Maxid_sales_billing?companyid=' + id
    );
  }

  getSalesList(id: any, date: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SalesBilling/get_sales_billing?companyid=' + id + '&date=' + date);
  }

  getSalesNestedList(entryid: number): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'SalesBilling/get_sales_billing_nested?entryid=' + entryid
    );
  }

  getMultipleSalesReport(entryid: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'MulitipleSalesBilling/get_multiple_sales_report?entryid=' + entryid);
  }

  delete(entryid: any): Observable<any> {
    return this.http.delete<any>(this.apiUrl + 'MulitipleSalesBilling/delete_sales_billing?entryid=' + entryid);
  }
}
