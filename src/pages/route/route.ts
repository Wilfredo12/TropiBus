import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import { RoutesStopsService } from '../../providers/routes-stops-service';

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
  locationMarker:any;
  nearbyStopMarker:any;
  constructor(public navCtrl: NavController, public params: NavParams, public alertCtrl:AlertController, public routes_stops_service:RoutesStopsService) {
    this.route=params.get("route");
    console.log("entre a la ruta especifica")
  }
  ngOnInit(){

      
    // this.stops=[{id:0,name: "Stop 1",description:"Plaza Colon",lat:-34.9301,lng:138.6000},
    // {id:1,name: "Stop 2",description:"MyrAngle",lat:-34.9400,lng:138.6100},
    // {id:2,name: "Stop 3",description:"Fabrica de galleta",lat:-34.9430,lng:138.6015},
    // {id:3,name: "Stop 4",description:"Palomino",lat:-34.9601,lng:138.6111},
    //  {id:4,name: "Stop 5",description:"Perra",lat:-34.9611,lng:138.6111}
    // ];

    //meterle el objecto de routes y stops
    this.stops=[]
    this.loadMap();
  }

  loadMap(){

      let latLng = new google.maps.LatLng(this.route.path[0].lat,this.route.path[0].lng);
      console.log(latLng);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.loadRoute();
      this.getStops();  
 
  }
  getStops(){
    //todo usar getStops con ruta especifica
    this.routes_stops_service.getStops().subscribe(response =>{
        var tempstops=response.stops;
        for(var i=0;i<tempstops.length;i++){
          if(tempstops[i].route_ID==this.route.route_ID){
            this.stops.push(tempstops[i])
          }
        }
        this.loadStops();
  })
}

  loadRoute(){
    var polyline = new google.maps.Polyline({
          map: this.map,
          path: this.route.path,
          strokeColor: this.route.color,
          strokeOpacity: 1.0,
          strokeWeight: 3
        });
        let content= "<h4>"+this.route.route_name+"</h4><p>"+this.route.route_description+"</p>"
        this.addInfoWindow(polyline,content)
  }
  loadStops(){
    
    for(var i=0;i<this.stops.length;i++){        
        let marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: new google.maps.LatLng(this.stops[i].stop_latitude,this.stops[i].stop_longitude)
            });
          
        let content = this.stops[i].description;          
          
        this.addInfoWindow(marker, content);
      

    }
  
}
centerStop(stop){

    this.map.panTo(new google.maps.LatLng(stop.stop_latitude,stop.stop_longitude));
}
nearbyStop(){ 
    if(this.locationMarker!=null||this.nearbyStopMarker!=null){
      this.locationMarker.setMap(null);
      this.nearbyStopMarker.setMap(null);
    }
    Geolocation.getCurrentPosition().then((myposition) => {
        let latitude=myposition.coords.latitude;
        let longitude=myposition.coords.longitude;
        let latLng = new google.maps.LatLng(myposition.coords.latitude, myposition.coords.longitude);
        ///keep going
        let nearbyStopCoordinates= this.getShortestDistance(latitude, longitude);
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
getShortestDistance(lat,lng){
  var shortestDistance=1000
  var closestCoordinates={stop_latitude:0,stop_longitude:0}
  for(var i=0;i<this.stops.length;i++){
    var stop=this.stops[i]
    var distance=this.harvesineFormula(lat,lng,stop.stop_latitude,stop.stop_longitude)
    if(distance<shortestDistance){
      shortestDistance=distance;
      closestCoordinates.stop_latitude=stop.stop_latitude;
      closestCoordinates.stop_longitude=stop.stop_longitude;
    }
  }
  return closestCoordinates;
}
harvesineFormula(lat1,lon1,lat2,lon2){
  var R = 6371e3; // metres
  var φ1 = this.toRad(lat1);
  var φ2 = this.toRad(lat2);
  var Δφ = this.toRad(lat2-lat1);
  var Δλ = this.toRad(lon2-lon1);

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var d = R * c;
  return d
}
toRad(Value) {
    return Value * Math.PI / 180;
}
addInfoWindow(item, content){
 
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


}
