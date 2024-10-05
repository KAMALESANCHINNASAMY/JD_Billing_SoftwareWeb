import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
    providedIn: 'root',
})

export class thirdPartySupplyReturnService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient, private configService: ConfigService) { }

    get(id: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartySupplyReturn/get_return_supply_to_thirdparty?companyid=' + id + '&return_date=' + date);
    }

    getSupplyList(id: number, third_partyid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartySupplyReturn/get_supply_to_thirdpartybyid?companyid=' + id + '&third_partyid=' + third_partyid);
    }
    getMaxId(id: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartySupplyReturn/get_Maxid_return_supply_to_thirdparty?companyid=' + id);
    }
    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
        return this.http.post<any>(this.apiUrl + 'ThirdPartySupplyReturn/Insert_return_supply_to_thirdparty', value, httpOptions);
    }

    getReturnNested(id: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'ThirdPartySupplyReturn/get_return_supply_to_thirdparty_nested?returnid=' + id);
    }
}