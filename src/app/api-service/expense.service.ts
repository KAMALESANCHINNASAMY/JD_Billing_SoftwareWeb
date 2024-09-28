import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class expenseMasterService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getList(companyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ExpenseMaster/get_expense_master?companyid=' + companyid);
    }

    newExpense(unitInsert: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'ExpenseMaster/Insert_expense_master', unitInsert, httpOptions);
    }

    delete(expenseid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'ExpenseMaster/Delete_expense_master?expenseid=' + expenseid);
    }
}
