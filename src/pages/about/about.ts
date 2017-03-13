import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Messages } from '../../providers/messages';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  messages:any;
  constructor(public navCtrl: NavController,public messageService:Messages) {
    this.getMessages();
  }
  getMessages(){
    this.messageService.getMessages().subscribe(response =>{
        this.messages=response.messages;
        
        console.log(response)
  })
  }
}
