import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ConfigService } from "../configuration.service";

@Injectable({
    providedIn: 'root'
})
export class rawMaterialPurchaseService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient,
        private configService: ConfigService) {
    }

    getRawMAtrialLists(id: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'RawMaterialPurchase/get_raw_material_purchase?companyid=' + id + '&date=' + date);
    }

    getRawMAtrialNestedLists(purchaseid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'RawMaterialPurchase/get_raw_material_purchasenested?purchaseid=' + purchaseid);
    }

    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'RawMaterialPurchase/Insert_raw_material_purchase', value, httpOptions);
    }

    getMaxId(id: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'RawMaterialPurchase/get_Maxid_material_purchase?companyid=' + id);
    }

    delete(purchaseid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'RawMaterialPurchase/Delete_raw_material_purchase?purchaseid=' + purchaseid);
    }

    // getMaterialPurchaseReport(puchaseid: number): Observable<any[]> {
    //     return this.http.get<any[]>(
    //         this.apiUrl +
    //         'RawMaterialPurchase/get_rawMaterial_purchase_bill?purchaseid=' +
    //         puchaseid
    //     );
    // }
}
