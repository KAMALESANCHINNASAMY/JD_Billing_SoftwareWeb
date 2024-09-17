import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class weaverMasterService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getList(companyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'WeaverMaster/get_weaver_master?companyid=' + companyid);
    }

    newWeaver(unitInsert: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'WeaverMaster/Insert_weaver_master', unitInsert, httpOptions);
    }

    delete(weaverid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'WeaverMaster/delete_weaver_master?weaverid=' + weaverid);
    }
}
