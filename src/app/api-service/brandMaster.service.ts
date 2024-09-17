import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class brandMasterService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getList(companyid: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'BrandMaster/get_brand_master?companyid=' + companyid);
    }

    newBrand(unitInsert: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'BrandMaster/Insert_brand_master', unitInsert, httpOptions);
    }

    delete(brandid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'BrandMaster/Delete_brand_master?brandid=' + brandid);
    }
}
