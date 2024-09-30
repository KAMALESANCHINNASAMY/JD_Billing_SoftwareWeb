import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class bankMasterService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getList(companyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'BankMaster/get_bank_master?companyid=' + companyid);
    }

    newBank(unitInsert: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'BankMaster/Insert_bank_master', unitInsert, httpOptions);
    }

    delete(bankid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'BankMaster/Delete_bank_master?bankid=' + bankid);
    }
}
