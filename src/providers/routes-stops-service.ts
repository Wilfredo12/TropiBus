import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class RoutesStopsService {
  HTTP:any;
  
  constructor(public http: Http) {
    this.HTTP=http;
    console.log('Hello RoutesStopsService Provider');
  }
  getRoutes(){
    return this.HTTP.get("assets/data/routes.json")
        .map(res =>res.json());
  }
  getStops(){
    
  }
}
