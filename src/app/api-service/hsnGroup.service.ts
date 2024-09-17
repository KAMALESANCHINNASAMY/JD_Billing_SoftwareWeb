import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class hsnMasterService {
  readonly apiUrl = this.ConfigService.BSfwUrl;

  constructor(private http: HttpClient, private ConfigService: ConfigService) {}

  getHSNGroup(companyid: any): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any[]>(
      this.apiUrl + 'HSNGroup/get?companyid=' + companyid,
      httpOptions
    );
  }

  newHSNGroup(hsnInsert: any): Observable<any> {
    debugger
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<any>(
      this.apiUrl + 'HSNGroup/Insert_hsn_group',
      hsnInsert,
      httpOptions
    );
  }
  deleteHSNGroup(hsnid: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.delete<any>(
      this.apiUrl + 'HSNGroup/Delete_hsn_group?hsnid=' + hsnid,
      httpOptions
    );
  }
  // getMaxID(companyid: any): Observable<any[]> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //   };
  //   return this.http.get<any>(
  //     this.apiUrl + 'HSNGroup/Get_MaxID_hsn_group?companyid=' + companyid,
  //     httpOptions
  //   );
  // }
}
