import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigService } from "../configuration.service";

@Injectable({
  providedIn: 'root'
})

export class ThirdPartyReportsService {
  readonly apiUrl = this.ConfigService.BSfwUrl;
  constructor(private http: HttpClient, private ConfigService: ConfigService) { }

  getThirdPartyPurchaseFromToDate(fromdate: any, todate: any, third_partyid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'ThirdPartyPurchaseReports/get_Third_partygst_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&third_partyid=' + third_partyid + '&companyid=' + companyid
    )
  }

  getThirdPartyNongstPurchaseFromToDate(fromdate: any, todate: any, third_partyid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'ThirdPartyPurchaseReports/get_Third_partyNongst_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&third_partyid=' + third_partyid + '&companyid=' + companyid
    )
  };

  getThirdPartygstPurchasebyPartyId(thirdparty_id: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'ThirdPartyPurchaseReports/get_gstPurchase_report_bythird_partyid?third_partyid=' + thirdparty_id + '&companyid=' + companyid
    )
  };

  getThirdPartyNongstPurchasebyPartyId(thirdparty_id: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'ThirdPartyPurchaseReports/get_NongstPurchase_report_bythird_partyid?third_partyid=' + thirdparty_id + '&companyid=' + companyid
    )
  };

  getThirdPartygstPurchaseReturnFromToDate(fromdate: any, todate: any, third_partyid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'ThirdPartyPurchaseReports/get_thirdPartygst_purchase_return_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&third_partyid=' + third_partyid + '&companyid=' + companyid
    )
  };

  getThirdPartyNongstPurchaseReturnFromToDate(fromdate: any, todate: any, third_partyid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'ThirdPartyPurchaseReports/get_thirdPartyNongst_purchase_return_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&third_partyid=' + third_partyid + '&companyid=' + companyid
    )
  };

  getThirdPartygstPurchasePaymentFromToDate(fromdate: any, todate: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'ThirdPartyPurchaseReports/get_thirdParty_payment_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&companyid=' + companyid
    )
  };

  getThirdPartyNongstPurchasePaymentFromToDate(fromdate: any, todate: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'ThirdPartyPurchaseReports/get_thirdPartyNongst_payment_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&companyid=' + companyid
    )
  };

}
