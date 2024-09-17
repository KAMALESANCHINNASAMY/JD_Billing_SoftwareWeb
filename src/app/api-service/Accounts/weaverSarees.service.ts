import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
  providedIn: 'root',
})
export class weaverSareesService {
  readonly apiUrl = this.configService.BSfwUrl;
  constructor(private http: HttpClient, private configService: ConfigService) { }

  addNew(value: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<any>(
      this.apiUrl + 'WeaverSarees/Insert_weavers_purchase',
      value,
      httpOptions
    );
  }

  getWeaverSareesList(id: number, date: string): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl +
      'WeaverSarees/get_weavers_purchase?companyid=' +
      id +
      '&date=' +
      date
    );
  }

  getWeaverSareesNestedList(purchaseid: number): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl +
      'WeaverSarees/Get_weavers_purchase_nested?purchaseid=' +
      purchaseid
    );
  }

  getWeaverRefCode(id: any, weaverid: any): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl +
      'WeaverSarees/get_RefCode_weaver_purchase?companyid=' +
      id +
      '&weaverid=' +
      weaverid
    );
  }

  delete(purchaseid: any): Observable<any> {
    return this.http.delete<any>(this.apiUrl + 'WeaverSarees/delete_weavers_purchase?purchaseid=' + purchaseid);
  }
}
