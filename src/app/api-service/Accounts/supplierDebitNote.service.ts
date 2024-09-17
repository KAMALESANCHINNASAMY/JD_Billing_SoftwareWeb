import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
  providedIn: 'root',
})
export class SupplierDebitNoteService {
  readonly apiUrl = this.configService.BSfwUrl;
  constructor(private http: HttpClient, private configService: ConfigService) { }

  getSupplierDebitDetails(id: number, date: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SupplierDebitNote/Get_supplier_debit_note?companyid=' + id + '&return_date=' + date);
  }

  getMaxId(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'SupplierDebitNote/Get_Maxid_supplier_debit_note?companyid=' + id);
  }

  getRawmatPBySupbno(id: number, purchaseid: number) {
    return this.http.get<any[]>(this.apiUrl + 'SupplierDebitNote/get_rawmaterial_purchase_by_supplier_bill_no?companyid=' + id + '&purchaseid=' + purchaseid);
  }

  getSupplierDebitNestedLists(s_debitid: number): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl +
      'SupplierDebitNote/get_supplier_debit_note_nested?s_debitid=' +
      s_debitid
    );
  }

  getRawMatDetailsPurchased(
    companyid: any,
    supplierid: any
  ): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl +
      'SupplierDebitNote/get_supplierbno_by_supid?companyid=' +
      companyid +
      '&supplierid=' +
      supplierid
    );
  }

  addNew(value: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<any>(
      this.apiUrl + 'SupplierDebitNote/Insert_supplier_debit_note',
      value,
      httpOptions
    );
  }
}
