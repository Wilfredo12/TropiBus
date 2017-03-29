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

      let mapOptions = {
        // center: latLng,
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
        this.centerMap(this.stops[0].stop_latitude,this.stops[0].stop_longitude);
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
          
        let content = "<h4>"+this.stops[i].stop_name+"</h4><p>"+this.stops[i].stop_description+"</p>";          
          
        this.addInfoWindow(marker, content);
      

    }
  
}
centerMap(lat,lng){
   let latLng = new google.maps.LatLng(lat,lng);
   this.map.setCenter(latLng);
}
centerStop(stop){
  //todo highlight stop
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
        // let latitude=myposition.coords.latitude;
        // let longitude=myposition.coords.longitude;
        let latLng = new google.maps.LatLng(latitude, longitude);
        ///keep going
       
        this.locationMarker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });
        let content = "<h4>Your Location!</h4>"; 
        //anadir que abra infowindow o boton         
        this.addInfoWindow(this.locationMarker, content);

        let nearbyStopCoordinates= this.getShortestDistance(latitude, longitude);
        console.log("nearby coordinates",nearbyStopCoordinates)
        let nearbyLatLng=new google.maps.LatLng(nearbyStopCoordinates.stop_latitude,nearbyStopCoordinates.stop_longitude);
        this.nearbyStopMarker=new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: nearbyLatLng
        });
        let content1 = "<h4>NearbyStop</h4>"; 
        this.addInfoWindow(this.nearbyStopMarker,content1)

        this.map.panTo(nearbyLatLng);
       }, (err) => {
         this.presentAlert('Location not enable','Please go to location settings and enable location')
    });
 
}
getShortestDistance(lat,lng){
  var shortestDistance=10e10
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
//harvesine formula is use to calculate the distance of two points on the sphere 
//using the latitudes and longitudes of the points
harvesineFormula(lat1,lon1,lat2,lon2){
  //phi is latitude
  //lambda are longitudes
  var R = 6371e3; // metres
  var phi1 = this.toRad(lat1);
  var phi2 = this.toRad(lat2);
  var delta_phi = this.toRad(lat2-lat1);
  var delta_lambda = this.toRad(lon2-lon1);

  var a = Math.sin(delta_phi/2) * Math.sin(delta_phi/2) +
          Math.cos(phi1) * Math.cos(phi2) *
          Math.sin(delta_lambda/2) * Math.sin(delta_lambda/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var distance = R * c;
  console.log(distance)
  return distance
}
toRad(degrees) {
    return degrees * Math.PI / 180;
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
presentAlert(title,subTitle){
let alert = this.alertCtrl.create({
                title: title,
                subTitle: subTitle,
                buttons: ['Dismiss']
              });
              alert.present();
}

}
