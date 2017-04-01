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
    //when initialized called get messages
    this.getMessages();
  }
  //method to ge all the messages from the backend
  getMessages(){
    this.messageService.getMessages().subscribe(response =>{
        this.messages=response.messages;
        
        console.log(response)
  })
  }
}
