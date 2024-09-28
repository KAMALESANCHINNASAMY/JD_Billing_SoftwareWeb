import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class handCashEntryService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getList(companyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'HandCash/get_hand_cash_entry?companyid=' + companyid);
    }

    newHandCash(unitInsert: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'HandCash/Insert_hand_cash_entry', unitInsert, httpOptions);
    }

    delete(cashid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'HandCash/Delete_hand_cash_entry?cashid=' + cashid);
    }
}
