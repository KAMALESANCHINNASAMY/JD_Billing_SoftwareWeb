import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigService } from '../configuration.service';

@Injectable({
    providedIn: 'root',
})

export class weaversReportService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }


    getWeaversid(weaverid: any, companyid: any): Observable<any[]> {
        return this.http.get<any[]>(
            this.apiUrl + 'WeaversReports/get_weavers_wise_given_received?weaverid=' + weaverid + '&companyid=' + companyid
        )
    };

}
