import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class userProfileService {
  readonly apiUrl = this.ConfigService.BSfwUrl;

  constructor(private http: HttpClient, private ConfigService: ConfigService) { }

  getUsersList(companyid: number): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.get<any[]>(this.apiUrl + 'UserProfile/Get?companyid=' + companyid, httpOptions);
  }

  newUserProfile(userInsert: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<any>(
      this.apiUrl + 'UserProfile/Insert_user_profile',
      userInsert,
      httpOptions
    );
  }
  deleteuser(userid: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.delete<any>(
      this.apiUrl + 'UserProfile/Delete_user_profile?userid=' + userid,
      httpOptions
    );
  }
}
