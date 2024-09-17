import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  readonly BSfwUrl = 'https://localhost:44391/api/';
}
