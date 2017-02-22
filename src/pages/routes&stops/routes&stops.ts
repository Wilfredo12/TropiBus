import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RoutePage } from '../route/route';

@Component({
  selector: 'routes_stops',
  templateUrl: 'routes&stops.html'
})
export class Routes_StopsPage {

  routes: any;

  constructor(public navCtrl: NavController) {

  }

  ngOnInit(){
    this.routes=[{id:0,name: "Route 1",description:"Esta ruta lleva a la plaza colon"},
    {id:1,name: "Route 2",description:"Ruta hacia el mani"},
    {id:2,name: "Route 3",description:"Ruta hacia barrio trastalleres"},
    {id:3,name: "Route 4",description:"Ruta hacia RUM"}
    ];
  }

  viewRoute(route){
     this.navCtrl.push(RoutePage,{
          route:route
      });
  }

}
