import { HttpHeaders,HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})

export class itemMasterService{
  readonly apiUrl = this.ConfigService.BSfwUrl;

constructor(private http:HttpClient,private ConfigService:ConfigService){}

getItemMasterList(companyid:any):Observable<any[]>{
  const httpOptions={
    headers:new HttpHeaders({'Content-Type':'application/json'})
  };
  return this.http.get<any[]>(this.apiUrl+'ItemMaster/get?companyid='+companyid,httpOptions);
}

newItem(itemInsert:any):Observable<any>{
  const httpOptions={
    headers:new HttpHeaders({'Content-Type':'application/json'})
  };
  return this.http.post<any>(
  this.apiUrl+'ItemMaster/Insert_item_master',
  itemInsert,httpOptions
  );
}
deleteItem(itemid:any):Observable<any>{
  const httpOptions={
    headers:new HttpHeaders({'Content-Type':'application/json'})
  };
  return this.http.delete<any>(
    this.apiUrl+'ItemMaster/Delete_item_master?itemid='+
    itemid,
    httpOptions
  );
}
getMaxId(companyid:any):Observable<any[]>{
  const httpOptions={
    headers:new HttpHeaders({'Content-Type':'application/json'})
  };
  return this.http.get<any>(
    this.apiUrl+'ItemMaster/Get_MaxID_item_master?companyid='+companyid,
    httpOptions
  );
}


}
