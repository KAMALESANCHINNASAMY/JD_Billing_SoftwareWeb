import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
    providedIn: 'root',
})
export class weaverGivenReceivedService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient, private configService: ConfigService) { }

    addNewGiven(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'WeaversGivenReceived/insert_given_to_weavers', value, httpOptions);
    }

    addNewReceived(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'WeaversGivenReceived/insert_weavers_purchase_received', value, httpOptions);
    }

    getBoth(id: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'WeaversGivenReceived/get_weavers_given_received?companyid=' + id + '&date=' + date);
    }

    getGiventoweavers(purchaseid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'WeaversGivenReceived/get_giventoweavers?purchaseid=' + purchaseid);
    }

    getReceivedtoweavers(purchaseid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'WeaverSarees/Get_weavers_purchase_nested?purchaseid=' + purchaseid
        );
    }

    getWeaverRefCode(id: any, weaverid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'WeaverSarees/get_RefCode_weaver_purchase?companyid=' + id + '&weaverid=' + weaverid
        );
    }

    delete(purchaseid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'WeaverSarees/delete_weavers_purchase?purchaseid=' + purchaseid);
    }
    deleteGiven(purchaseid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'WeaversGivenReceived/delete_given_to_weavers?purchaseid=' + purchaseid);
    }
}
