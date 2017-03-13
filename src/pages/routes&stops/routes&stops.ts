import { Component } from '@angular/core';
import { NavController,AlertController  } from 'ionic-angular';
import { RoutePage } from '../route/route';
import { RoutesStopsService } from '../../providers/routes-stops-service';

@Component({
  selector: 'routes_stops',
  templateUrl: 'routes&stops.html'
})
export class Routes_StopsPage {

  routes: any;

  constructor(public navCtrl: NavController, public alertCtrl:AlertController, public routeService:RoutesStopsService ) {

  }

  ngOnInit(){
    this.routeService.getRoutes().subscribe(response =>{
        this.routes=response.routes;
        console.log(response)
  })
  }
  viewDescription(route){
    let alert = this.alertCtrl.create({
    title: route.route_name,
    subTitle: route.route_description,
    buttons: ['OK']
  });
  alert.present();
  }
  viewRoute(route){
     this.navCtrl.push(RoutePage,{
          route:route
      });
  }
  getStatus(status){
    if(status=="Active"){
      return "secondary"
    }
    else if(status == "Inactive"){
      return "danger"
    }
    else return "dark"
  }

}
