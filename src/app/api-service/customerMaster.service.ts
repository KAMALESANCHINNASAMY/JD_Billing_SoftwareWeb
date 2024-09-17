import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class customerMasterService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getList(companyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'CustomerMaster/get_customer_master?companyid=' + companyid);
    }

    newCustomer(unitInsert: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'CustomerMaster/Insert_customer_master', unitInsert, httpOptions);
    }

    delete(customerid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'CustomerMaster/delete_customer_master?customerid=' + customerid);
    }

    getAdvanceList(customerid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'CustomerMaster/get_customer_advance?customerid=' + customerid);
    }
}
