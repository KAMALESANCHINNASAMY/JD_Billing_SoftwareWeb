import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
    providedIn: 'root',
})
export class expenseEntryService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getList(companyid: any, date: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ExpenseEntry/get_expense_entry?companyid=' + companyid + '&date=' + date);
    }

    newEntry(newList: any[]): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'ExpenseEntry/Insert_expense_entry', newList, httpOptions);
    }

    delete(entryid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'ExpenseEntry/Delete_expense_entry?entryid=' + entryid);
    }
}
