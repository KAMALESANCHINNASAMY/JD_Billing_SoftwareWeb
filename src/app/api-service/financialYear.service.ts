import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class financialYearService {
  readonly apiUrl = this.ConfigService.BSfwUrl;

  constructor(private http: HttpClient, private ConfigService: ConfigService) {}

  getFinancialYrList(companyid: any): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any[]>(
      this.apiUrl + 'FinancialYear/get?companyid=' + companyid,
      httpOptions
    );
  }

  newFinancialYear(yearInsert: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<any>(
      this.apiUrl + 'FinancialYear/Insert_financial_year',
      yearInsert,
      httpOptions
    );
  }
  deleteFinYear(finyearid: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.delete<any>(
      this.apiUrl +
        'FinancialYear/Delete_financial_year?finyearid=' +
        finyearid,
      httpOptions
    );
  }
  getActiveFinYear(companyid: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any[]>(
      this.apiUrl + 'FinancialYear/getActiveFinyr?companyid=' + companyid,
      httpOptions
    );
  }

  setActiveFinYear(finyearid: any, companyid: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.put<any>(
      this.apiUrl +
        'FinancialYear/UpdateActiveStatus_financial_year?finyearid=' +
        finyearid +
        '&companyid=' +
        companyid,
      httpOptions
    );
  }
}
