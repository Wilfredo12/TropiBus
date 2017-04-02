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
  //this method retrieves all the routes information from the routes.json
  getRoutes(){
    return this.HTTP.get("assets/data/routes.json")
        .map(res =>res.json());
  }
  //this method retrieves all the stops information from stops.json
  getStops(){
    return this.HTTP.get("assets/data/stops.json")
        .map(res =>res.json());
  }
  //this method retrieves a particular routes that has a specific routeid
  getRoute(routeid){
       return this.HTTP.get("assets/data/route"+routeid+".json")
        .map(res =>res.json());
  }
  //this gets all the stops from a specific route with a defined routeid
  getStopsFromRoute(routeid){
       return this.HTTP.get("assets/data/stops"+routeid+".json")
        .map(res =>res.json());
  }
}


