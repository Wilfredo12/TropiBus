import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController } from 'ionic-angular';
import {Geolocation} from 'ionic-native';


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
 
  constructor(public navCtrl: NavController) {
 
  }
 
  ngOnInit(){
    //checkInternet connection
    this.loadMap();
    //this.loadRoutes();
    //this.loadStops();
  }
 
  loadMap(){
 
    Geolocation.getCurrentPosition().then((myposition) => {
 
      let latLng = new google.maps.LatLng(myposition.coords.latitude, myposition.coords.longitude);
      
      console.log(myposition.coords.latitude+" "+ myposition.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        })
      let content= "<h4>Your location</h4>"
      this.addInfoWindow(marker,content)
   
 
    }, (err) => {
      console.log(err);
    });
 
  }

  loadRoutes(){

    for(var i=0;i<this.routes.length;i++){
      var route=this.routes[i];
      var polyline = new google.maps.Polyline({
          map: this.map,
          path: route.path,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        var content= "<h4>"+route.route_name+"</h4><p>"+route.route_description+"</p>"
        this.addInfoWindow(polyline,content)
    }
    // var flightPathCoordinates = [
    //       {lat: 18.3586, lng:-66.0702},  
    //       {lat: 18.9001, lng: -66.1234},
    //       {lat: 18.142, lng: -66.4500},
    //       {lat: 18.242, lng: -66.4700}
    //     ];

    // var flightPath = new google.maps.Polyline({
    //       map: this.map,
    //       path: flightPathCoordinates,
    //       strokeColor: '#FF0000',
    //       strokeOpacity: 1.0,
    //       strokeWeight: 2
    //     });
  }
  loadStops(){
    for(var i=0;i<this.stops.length;i++){
      var stop=this.stops[i]
      var latlng = new google.maps.LatLng(stop.latitude, stop.longitude);
      let stop_marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latlng
      });
      let content="<h4>"+stop.stop_name+"</h4><p>"+stop.stop_description+"</p>"
      this.addInfoWindow(stop_marker,content)
    }
  }
  myLocation(){
    Geolocation.getCurrentPosition().then((myposition) => {
        let latLng = new google.maps.LatLng(myposition.coords.latitude, myposition.coords.longitude);
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });
        let content = "<h4>Your Location!</h4>"; 
        //anadir que abra infowindow o boton         
        this.addInfoWindow(marker, content);
       }, (err) => {
      console.log(err);
    });
  }

//   addMarker(){
 
//   let marker = new google.maps.Marker({
//     map: this.map,
//     animation: google.maps.Animation.DROP,
//     position: this.map.getCenter()
//   });
 
//   let content = "<h4>Information!</h4>";          
 
//   this.addInfoWindow(marker, content);
 
// }
addInfoWindow(item, content){
 
  let infoWindow = new google.maps.InfoWindow({
    content: content
  });
 
  google.maps.event.addListener(item, 'click', () => {
    
   if (infoWindow) { infoWindow.close();}
        infoWindow.open(this.map, item);

  });
 
}
}
