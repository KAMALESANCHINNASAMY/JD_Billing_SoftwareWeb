import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../configuration.service';

@Injectable({
    providedIn: 'root',
})
export class layOutService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    getLoginUserList(id: any): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'UserProfile/get_userbyid?userid=' + id);
    }
}
