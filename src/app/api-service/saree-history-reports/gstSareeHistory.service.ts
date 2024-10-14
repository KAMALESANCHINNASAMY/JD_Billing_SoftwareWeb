import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigService } from "../configuration.service";

@Injectable({
  providedIn: 'root'
})

export class SareeGstHistory {

  readonly apiUrl = this.ConfigService.BSfwUrl;

  constructor(private http: HttpClient, private ConfigService: ConfigService) { }


  getGStSareeHistoryByref_code(companyid: any, ref_code: any,): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get<any[]>(
      this.apiUrl + 'SareegstHistory/get_gst_purchase_historyof_sareeby_ref_code?companyid=' + companyid + '&ref_code=' + ref_code, httpOptions
    )
  };

  getGStSareeHistoryBysi_code(companyid: any, si_code: any,): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'SareegstHistory/get_gst_purchase_historyof_sareeby_si_code?companyid=' + companyid + '&si_code=' + si_code
    )
  };
}
