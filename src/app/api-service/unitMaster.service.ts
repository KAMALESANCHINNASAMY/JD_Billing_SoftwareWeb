import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class unitMasterService {
  readonly apiUrl = this.ConfigService.BSfwUrl;

  constructor(private http: HttpClient, private ConfigService: ConfigService) { }

  getUnitsList(companyid: any): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any[]>(
      this.apiUrl + 'UnitMaster/get?companyid=' + companyid,
      httpOptions
    );
  }

  newUnit(unitInsert: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-type': 'application/json' }),
    };

    return this.http.post<any>(
      this.apiUrl + 'UnitMaster/Insert_unit_master',
      unitInsert,
      httpOptions
    );
  }
  deleteUnit(unitid: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.delete<any>(
      this.apiUrl + 'UnitMaster/Delete_unit_master?unitid=' + unitid,
      httpOptions
    );
  }
}
