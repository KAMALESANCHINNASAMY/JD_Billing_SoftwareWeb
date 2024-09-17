import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class itemGroupService {
  readonly apiUrl = this.ConfigService.BSfwUrl;

  constructor(private http: HttpClient, private ConfigService: ConfigService) { }

  getItemGroupList(companyid: any): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get<any[]>(
      this.apiUrl + 'ItemGroup/get?companyid=' + companyid,
      httpOptions
    );
  }
  newItemGroupIns(itemGroupInsert: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<any>(
      this.apiUrl + 'ItemGroup/Insert_item_group',
      itemGroupInsert, httpOptions
    );
  }
  deleteItemGroup(item_groupid: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.delete<any>(
      this.apiUrl + 'ItemGroup/Delete_item_group?item_groupid=' +
      item_groupid,
      httpOptions
    );
  }

}
