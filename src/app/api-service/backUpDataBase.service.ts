import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
    providedIn: 'root',
})
export class backUpDataBaseService {
    readonly apiUrl = this.ConfigService.BSfwUrl;

    constructor(private http: HttpClient, private ConfigService: ConfigService) { }

    backUp(): Observable<any> {
        debugger
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };
        return this.http.put<any>(
            this.apiUrl + 'BackUpDataBase/backUpDataBase', httpOptions
        );
    }
}
