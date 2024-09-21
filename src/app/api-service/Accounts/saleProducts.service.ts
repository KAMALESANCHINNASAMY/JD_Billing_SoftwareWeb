import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ConfigService } from "../configuration.service";

@Injectable({
    providedIn: 'root'
})
export class saleProductsService {
    readonly apiUrl = this.configService.BSfwUrl;
    constructor(private http: HttpClient,
        private configService: ConfigService) {
    }

    getSalesLists(id: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SaleProducts/get_sales_product?companyid=' + id + '&date=' + date);
    }

    getSalesNestedLists(entryid: number): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SaleProducts/get_sales_product_nested?entryid=' + entryid);
    }

    addNew(value: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'SaleProducts/Insert_sales_product', value, httpOptions);
    }

    getMaxId(id: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'SaleProducts/get_Maxid_sales_product?companyid=' + id);
    }

    delete(entryid: any): Observable<any> {
        return this.http.delete<any>(this.apiUrl + 'SaleProducts/Delete_sales_product?entryid=' + entryid);
    }
}
