import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import { RoutesStopsService } from '../../providers/routes-stops-service';
//import { ConnectivityService } from '../../providers/connectivity-service';

declare var google;

@Component({
  selector: 'maps-Overview',
  templateUrl: 'mapOverview.html'
})
export class MapOverviewPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  routes:any;
  stops:any;
  tempRoute:any;
  locationMarker:any;
  polylinePaths:any;
  constructor(public navCtrl: NavController,public routes_stops_service:RoutesStopsService, public alertCtrl:AlertController) {
    
    
    
  }
 
  ngOnInit(){
    //checkInternet connection
    this.loadMap();
    this.routes=[]
    this.polylinePaths=[]
    //this.loadRoutes();
    //this.loadStops();
  }
 
  loadMap(){
 
    //Geolocation.getCurrentPosition().then((myposition) => {
      let latLng = new google.maps.LatLng(18.2013257,-67.1392801);
      console.log(latLng);
      
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      // let marker = new google.maps.Marker({
      //       map: this.map,
      //       animation: google.maps.Animation.DROP,
      //       position: latLng
      //   })
      // let content= "<h4>Your location</h4>"
      // this.addInfoWindow(marker,content)
      this.getRoutes();
    
  }

  getRoutes(){
    this.routes_stops_service.getRoutes().subscribe(response =>{
        this.routes=response.routes;
        this.loadRoutes();
        console.log(response)
  })
  }
  getStops(){
    this.routes_stops_service.getStops().subscribe(response =>{
        this.stops=response.stops;
        this.loadStops();
        console.log(response)
  })
}

  loadRoutes(){

    for(var i=0;i<this.routes.length;i++){
        var route=this.routes[i];
        if(route.route_area=="city"){
          console.log(route)
          var polyline = new google.maps.Polyline({
              map: this.map,
              path: route.path,
              strokeColor: route.color,
              strokeOpacity: 1.0,
              strokeWeight: 3
            });
            let content= "<h4>"+route.route_name+"</h4><p>"+route.route_description+"</p>"
            this.addInfoWindowRoutes(polyline,content)
            this.polylinePaths.push(polyline)
        }
      }
  }
  
  loadStops(){
    for(var i=0;i<this.stops.length;i++){
      var stop=this.stops[i]
      var latlng = new google.maps.LatLng(stop.stop_latitude, stop.stop_longitude);
      let stop_marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latlng
      });
      let content="<h4>"+stop.stop_name+"</h4><p>"+stop.stop_description+"</p>"
      this.addInfoWindow(stop_marker,content)
    }
  }

  city(){
      this.map.panTo(new google.maps.LatLng(18.2013257,-67.1392801));
      for(var i=0;i<this.polylinePaths.length;i++){
      this.polylinePaths[i].setMap(null);
    }
    this.polylinePaths=[]
    this.loadRoutes()
  }

  rural(){
    this.map.panTo(new google.maps.LatLng(18.2047609,-67.1385972));
    for(var i=0;i<this.polylinePaths.length;i++){
      this.polylinePaths[i].setMap(null);
    }
    this.polylinePaths=[]
    for(var i=0;i<this.routes.length;i++){
        var route=this.routes[i];
        if(route.route_area=="rural"){
          console.log(route)
          var polyline = new google.maps.Polyline({
              map: this.map,
              path: route.path,
              strokeColor: route.color,
              strokeOpacity: 1.0,
              strokeWeight: 3
            });
            let content= "<h4>"+route.route_name+"</h4><p>"+route.route_description+"</p>"
            this.addInfoWindowRoutes(polyline,content)
            this.polylinePaths.push(polyline)
        }
      }

  }

  litoral(){
    this.map.panTo(new google.maps.LatLng(18.2047609,-67.1385972));
    for(var i=0;i<this.polylinePaths.length;i++){
      this.polylinePaths[i].setMap(null);
    }
    this.polylinePaths=[]
    for(var i=0;i<this.routes.length;i++){
        var route=this.routes[i];
        if(route.route_area=="litoral"){
          console.log(route)
          var polyline = new google.maps.Polyline({
              map: this.map,
              path: route.path,
              strokeColor: route.color,
              strokeOpacity: 1.0,
              strokeWeight: 3
            });
            let content= "<h4>"+route.route_name+"</h4><p>"+route.route_description+"</p>"
            this.addInfoWindowRoutes(polyline,content)
            this.polylinePaths.push(polyline)
        }
      }
  }
  myLocation(){
    if(this.locationMarker!=null){
      this.locationMarker.setMap(null);
    }
    Geolocation.getCurrentPosition().then((myposition) => {
        let latLng = new google.maps.LatLng(myposition.coords.latitude, myposition.coords.longitude);
        this.locationMarker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });
        let content = "<h4>Your Location!</h4>"; 
        //anadir que abra infowindow o boton         
        this.addInfoWindow(this.locationMarker, content);
        this.map.panTo(latLng);
       }, (err) => {
         let alert = this.alertCtrl.create({
            title: 'Location not enable',
            subTitle: 'Please go to location settings and enable location',
            buttons: ['Dismiss']
          });
          alert.present();
          console.log(err);
    });
  }
addInfoWindow(item,content){
  let infowindow = new google.maps.InfoWindow({
    content: content
  });
   google.maps.event.addListener(item, 'click', (event) => {
   if(!item.open){
                infowindow.setPosition(event.latLng)
                infowindow.open(this.map,item);
                item.open = true;
            }
            else{
                infowindow.close();
                item.open = false;
            }
            google.maps.event.addListener(this.map, 'click', function() {
                infowindow.close();
                item.open = false;
            });

  });
}
addInfoWindowRoutes(item, content){
 
  let infowindow = new google.maps.InfoWindow({
    content: content
  });
  google.maps.event.addListener(item, 'mouseover', function(latlng) {
            let path = item.getPath();
            var polyline = new google.maps.Polyline({
                map: this.map,
                path: path,
                strokeColor: "#42f4d9",
                strokeOpacity: 1.0,
                strokeWeight: 7
              });
            this.tempRoute=polyline;
        // let content= "<h4>"+route.route_name+"</h4><p>"+route.route_description+"</p>"
        // this.addInfoWindowRoutes(polyline,content)
  });

  google.maps.event.addListener(item, 'mouseout', function(latlng) {
            if(this.tempRoute!=undefined){
              this.tempRoute.setMap(null);
            }
  });
  google.maps.event.addListener(item, 'click', (event) => {

   if(!item.open){
                infowindow.setPosition(event.latLng)
                infowindow.open(this.map,item);
                item.open = true;
            }
            else{
                infowindow.close();
                item.open = false;
            }
            google.maps.event.addListener(this.map, 'click', function() {
                infowindow.close();
                item.open = false;
            });

  });
 
}

}
