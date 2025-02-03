import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class jobHandlingReportService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    jobInwardReport(companyid: any, third_partyid: any, fromdate: any, todate: any, productid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'JobHandlingReport/get_jobhandling_inward?companyid=' + companyid + '&third_partyid=' + third_partyid + '&fromdate=' + fromdate + '&todate=' + todate + '&productid=' + productid);
    }

    jobOutwardReport(companyid: any, third_partyid: any, fromdate: any, todate: any, productid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'JobHandlingReport/get_jobhandling_outward?companyid=' + companyid + '&third_partyid=' + third_partyid + '&fromdate=' + fromdate + '&todate=' + todate + '&productid=' + productid);
    }

    getJobHandlingLedger(id: any, fromdate: any, todate: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'JobHandlingReport/get_purchase_from_thirdparty_legger?third_partyid=' + id + '&fromdate=' + fromdate + '&todate=' + todate);
    }
}
