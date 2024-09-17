import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigService } from "./configuration.service";

@Injectable({
  providedIn: 'root'
})

export class companyDetailsService{
  readonly apiUrl=this.configService.BSfwUrl;
  constructor(private http:HttpClient,
    private configService:ConfigService){

    }

getList():Observable<any[]>{
  return this.http.get<any[]>(this.apiUrl+'CompanyMaster/Get')
}

addNewCompanyDetail(value:any):Observable<any>{
  const httpOptions={headers:new HttpHeaders({'Content-Type':'application/json'})};
  return this.http.post(this.apiUrl+'CompanyMaster/Insert_company_master',value,httpOptions);
}


delete(companyid:any):Observable<any>{
const httpOptions={
  headers:new HttpHeaders({'Content-Type':'application/json'})};
  return this.http.delete<any>(this.apiUrl+'CompanyMaster/Delete_company_master?companyid='+companyid,httpOptions)
}

// GetActiveStsCompany():Observable<any[]>{
//   return this.http.get<any[]>(this.apiUrl+'CompanyMaster/GetActiveStsCompany')
// }

setActiveStsCompany(companyid:any):Observable<any>{
  const httpOptions={headers:new HttpHeaders({'Content-Type':'application/json'})};
  return this.http.put<any>(this.apiUrl+'CompanyMaster/UpdateActiveStatus_company_master?companyid='+companyid,httpOptions)

}

}
