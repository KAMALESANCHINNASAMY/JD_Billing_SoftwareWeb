import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ConfigService } from "../configuration.service";

@Injectable({
    providedIn: 'root'
})
export class supplyThirdPartyService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient,
        private configService: ConfigService) {
    }

    getRawProductLists(id: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SupplyThirdParty/get_supply_to_thirdparty?companyid=' + id + '&date=' + date);
    }

    getRawProductNestedLists(supplyid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SupplyThirdParty/get_supply_to_thirdparty_nested?supplyid=' + supplyid);
    }

    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'SupplyThirdParty/Insert_supply_to_thirdparty', value, httpOptions);
    }

    getMaxId(id: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SupplyThirdParty/get_Maxid_supply_to_thirdparty?companyid=' + id);
    }

    delete(supplyid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'SupplyThirdParty/Delete_supply_to_thirdparty?supplyid=' + supplyid);
    }
}
