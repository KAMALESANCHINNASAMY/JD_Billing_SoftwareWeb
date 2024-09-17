import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class thirdPartyMasterService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getList(companyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartyMaster/get_third_party_master?companyid=' + companyid);
    }

    newParty(unitInsert: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'ThirdPartyMaster/Insert_third_party_master', unitInsert, httpOptions);
    }

    delete(third_partyid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'ThirdPartyMaster/delete_third_party_master?third_partyid=' + third_partyid);
    }

    getAdvanceList(third_partyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartyMaster/get_thirdparty_advance?third_partyid=' + third_partyid);
    }
}
