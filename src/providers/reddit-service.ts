import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class RedditService {
    htts:any;
    baseUrl: String;

  constructor(public http: Http) {
      this.htts=http;
      this.baseUrl='https://www.reddit.com/r'
    
  }
   getPosts(category, limit){

        return this.htts.get(this.baseUrl+'/'+category+'/top.json?limit='+limit)
        .map(res =>res.json());
    }
}
