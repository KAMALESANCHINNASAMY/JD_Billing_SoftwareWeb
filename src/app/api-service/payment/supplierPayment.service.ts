import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ConfigService } from "../configuration.service";

@Injectable({
  providedIn: 'root'
})

export class supplierPaymentService {

  readonly apiUrl = this.configService.BSfwUrl;
  constructor(private http: HttpClient,
    private configService: ConfigService) {
  }

  getSupplierPaymentsLists(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SupplierPayment/get_supplier_Payment_details?supplierid=' + id);
  }

  addNew(value: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
    return this.http.post<any>(this.apiUrl + 'SupplierPayment/Insert_supplier_payment', value, httpOptions);
  }
}
