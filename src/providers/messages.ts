import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class Messages {

  constructor(public http: Http) {
    console.log('Hello Messages Provider');
  }
getMessages(){
    return this.http.get("assets/data/messages.json")
        .map(res =>res.json());
  }
}
