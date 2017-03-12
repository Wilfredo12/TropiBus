import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Geolocation} from 'ionic-native';


declare var google;

@Component({
  selector: 'route',
  templateUrl: 'route.html'
})
export class RoutePage {
  
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  route:any;
  stops:any;
  
  constructor(public navCtrl: NavController, public params: NavParams) {
    this.route=params.get("route");
    console.log("entre a la ruta especifica")
  }
  ngOnInit(){

      
    this.stops=[{id:0,name: "Stop 1",description:"Plaza Colon",lat:-34.9301,lng:138.6000},
    {id:1,name: "Stop 2",description:"MyrAngle",lat:-34.9400,lng:138.6100},
    {id:2,name: "Stop 3",description:"Fabrica de galleta",lat:-34.9430,lng:138.6015},
    {id:3,name: "Stop 4",description:"Palomino",lat:-34.9601,lng:138.6111},
     {id:4,name: "Stop 5",description:"Perra",lat:-34.9611,lng:138.6111}
    ];

    //meterle el objecto de routes y stops
    this.loadMap();
  }

  loadMap(){

     // Geolocation.getCurrentPosition().then((myposition) => {
 
      let latLng = new google.maps.LatLng(-34.9201, 138.6666);
      console.log(latLng);
      let mapOptions = {
        center: latLng,
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      var marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        })
        this.loadStops();
    // }, (err) => {
    //   console.log(err);
    // });
   
 
  }

  loadStops(){
    
    for(var i=0;i<this.stops.length;i++){
        console.log(this.stops[i])
        let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: new google.maps.LatLng(this.stops[i].lat,this.stops[i].lng)
  });
 
  let content = this.stops[i].description;          
 
  this.addInfoWindow(marker, content);

    }
  
}
centerStop(stop){

    this.map.panTo(new google.maps.LatLng(stop.lat,stop.lng));


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
