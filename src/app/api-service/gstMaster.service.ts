import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class gstMasterService {
  readonly apiUrl = this.ConfigService.BSfwUrl;

  constructor(private http: HttpClient, private ConfigService: ConfigService) {}

  getGstMaster(companyid: any): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any[]>(
      this.apiUrl + 'GSTMaster/get?companyid=' + companyid,
      httpOptions
    );
  }

  newGstMasterIns(GSTInsert: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<any>(
      this.apiUrl + 'GSTMaster/Insert_gst_master',
      GSTInsert,
      httpOptions
    );
  }

  deleteGstMaster(gstid: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.delete<any>(
      this.apiUrl + 'GSTMaster/Delete_gst_master?gstid=' + gstid,
      httpOptions
    );
  }
  getMaxID(companyid: any): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any>(
      this.apiUrl + 'GSTMaster/Get_MaxID_gst_master?companyid=' + companyid,
      httpOptions
    );
  }
}
