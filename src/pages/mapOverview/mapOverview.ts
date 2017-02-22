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
 
  constructor(public navCtrl: NavController) {
 
  }
 
  ngOnInit(){
    this.loadMap();
  }
 
  loadMap(){
 
    Geolocation.getCurrentPosition().then((myposition) => {
 
      let latLng = new google.maps.LatLng(myposition.coords.latitude, myposition.coords.longitude);
      
      console.log(myposition.coords.latitude+" "+ myposition.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        })
    this.loadRoutes();
 
    }, (err) => {
      console.log(err);
    });
 
  }

  loadRoutes(){

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

  addMarker(){
 
  let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
  });
 
  let content = "<h4>Information!</h4>";          
 
  this.addInfoWindow(marker, content);
 
}
addInfoWindow(marker, content){
 
  let infoWindow = new google.maps.InfoWindow({
    content: content
  });
 
  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
  });
 
}
}
