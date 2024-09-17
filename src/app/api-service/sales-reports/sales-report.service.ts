import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigService } from '../configuration.service';

@Injectable({
  providedIn: 'root',
})

export class SalesReportService {
  readonly apiUrl = this.ConfigService.BSfwUrl;

  constructor(private http: HttpClient, private ConfigService: ConfigService) { }

  getSalesBillingFromToDate(fromdate: any, todate: any, customerid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'SalesReports/get_sales_billing_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&customerid=' + customerid + '&companyid=' + companyid
    )
  }

  getSalesBillingNongstFromToDate(fromdate: any, todate: any, customerid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'SalesReports/get_sales_billingNongst_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&customerid=' + customerid + '&companyid=' + companyid
    )
  };

  getSalesReportByCustomerid(customerid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'SalesReports/get_gstsales_report_bycustomerid?customerid=' + customerid + '&companyid=' + companyid
    )
  };

  getNongstSalesReportByCustomerid(customerid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'SalesReports/get_Nongstsales_report_bycustomerid?customerid=' + customerid + '&companyid=' + companyid
    )
  };

  getSalesBillingReturngstFromToDate(fromdate: any, todate: any, customerid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'SalesReports/get_sales_billing_return_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&customerid=' + customerid + '&companyid=' + companyid
    )
  };

  getSalesBillingReturnNongstFromToDate(fromdate: any, todate: any, customerid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'SalesReports/get_sales_billingNongst_return_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&customerid=' + customerid + '&companyid=' + companyid
    )
  };

  getSalesBillingPaymentsGstFromToDate(fromdate: any, todate: any, customerid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'SalesReports/get_sales_billing_payment_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&customerid=' + customerid + '&companyid=' + companyid
    )
  };

  getSalesBillingPaymentsNonGstFromToDate(fromdate: any, todate: any, customerid: any, companyid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + 'SalesReports/get_sales_billing_NONgstpayment_from_to_date?fromdate=' + fromdate + '&todate=' + todate + '&customerid=' + customerid + '&companyid=' + companyid
    )
  };

}
