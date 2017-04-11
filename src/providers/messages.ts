import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class Messages {

  constructor(public http: Http) {
    console.log('Hello Messages Provider');
  }
getMessages(){
   //let url="assets/data/messages.json"
   let url="http://localhost:8080/timuserRoutes/getMessages"
    return this.http.get(url)
        .map(res =>res.json());
  }
}
