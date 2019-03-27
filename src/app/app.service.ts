import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CacheReturnValue} from '../annotations/cache.annotation';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  constructor(private httpClient: HttpClient) {}

  @CacheReturnValue("getValue")
  getValue():Observable<any>{
    return this.httpClient.get<any>("https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&facet=overflowactivation&facet=creditcard&facet=kioskstate&facet=station_state");
  }


}