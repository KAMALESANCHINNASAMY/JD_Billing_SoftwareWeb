import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
  providedIn: 'root',
})
export class StockManagementService {
  readonly apiUrl = this.ConfigService.BSfwUrl;

  constructor(private http: HttpClient, private ConfigService: ConfigService) { }

  getStockDetails(type: any, fromdate: any, todate: any, si_code: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'StockTable/get_stock_table?companyid='
      + companyid + '&type=' + type + '&fromdate=' + fromdate + '&todate=' + todate + '&si_code=' + si_code);
  }

  getStockDetailsByweaver(weaverid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'StockTable/get_stock_table_by_weavers?companyid=' + companyid + '&weaverid=' + weaverid);
  }

  getStockDetailsByThirdPartyGst(third_partyid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'StockTable/get_stock_table_by_thirdparty?companyid=' + companyid + '&third_partyid=' + third_partyid);
  }

  getStockDetailsByThirdPartyNonGst(third_partyid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'StockTable/get_stock_table_by_thirdpartyNonGst?companyid=' + companyid + '&third_partyid=' + third_partyid);
  }
}
