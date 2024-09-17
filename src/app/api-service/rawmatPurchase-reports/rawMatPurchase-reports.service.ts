import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigService } from "../configuration.service";

@Injectable({
  providedIn: 'root'
})

export class RawMatPurchaseReportsService {
  readonly apiUrl = this.ConfigService.BSfwUrl;
  constructor(private http: HttpClient, private ConfigService: ConfigService) { }


  getRawMatPurchaseFromToDate(fromdate: any, todate: any, supplierid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'RawMaterialPurchaseReport/get_rawmat_purchase_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&supplierid=' + supplierid + '&companyid=' + companyid
    )
  }

  getRawMatPurchaseBySupplier(supplierid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'RawMaterialPurchaseReport/get_RawMatPurchase_report_bysupplierid?supplierid=' + supplierid + '&companyid=' + companyid
    )
  }

  getRawMatPurchaseReturnFromToDate(fromdate: any, todate: any, supplierid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'RawMaterialPurchaseReport/get_RawMaterial_purchase_return_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&supplierid=' + supplierid + '&companyid=' + companyid
    )
  }

  getRawMatPurchasePaymentFromToDate(fromdate: any, todate: any, supplierid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'RawMaterialPurchaseReport/get_RawMatpurchase_payment_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&supplierid=' + supplierid + '&companyid=' + companyid
    )
  }

  getPayment(fromdate: any, todate: any, supplierid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'RawMaterialPurchaseReport/get_supplier_payment?fromdate=' + fromdate + '&todate=' + todate + '&supplierid=' + supplierid + '&companyid=' + companyid
    )
  }

  delete(paymentid: any): Observable<any> {
    return this.http.delete<any>(this.apiUrl + 'RawMaterialPurchaseReport/delete_supplier_payment?paymentid=' + paymentid);
  }
}
