import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class SupplierMasterService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getList(companyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SupplierMaster/get_supplier_master?companyid=' + companyid);
    }

    newSupplier(unitInsert: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'SupplierMaster/Insert_supplier_master', unitInsert, httpOptions);
    }

    delete(supplierid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'SupplierMaster/delete_supplier_master?supplierid=' + supplierid);
    }

    getAdvanceList(supplierid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SupplierMaster/get_supplier_advance?supplierid=' + supplierid);
    }
}
