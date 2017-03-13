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
    return this.HTTP.get("assets/data/stops.json")
        .map(res =>res.json());
  }
  getRoute(routeid){
       return this.HTTP.get("assets/data/route"+routeid+".json")
        .map(res =>res.json());
  }
  getStopsFromRoute(routeid){
       return this.HTTP.get("assets/data/stops_route"+routeid+".json")
        .map(res =>res.json());
  }
}
