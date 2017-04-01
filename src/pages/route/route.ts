import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import { RoutesStopsService } from '../../providers/routes-stops-service';
import L from "leaflet";

@Component({
  selector: 'route',
  templateUrl: 'route.html'
})
export class RoutePage {
  
  map: any;
  route:any;
  stops:any;
  locationMarker:any=null;
  nearbyStopMarker:any=null;
  tempStopMarker:any=null;

  constructor(public navCtrl: NavController, public params: NavParams, public alertCtrl:AlertController, public routes_stops_service:RoutesStopsService) {
    //get route information from constructor
    this.route=params.get("route");
    
  }
  //method that runs when the page is inticialized
  ngOnInit(){
    this.stops=[]
    this.loadMap();
  }
  //method to load leaflet map container and openstreet map tile layer
  loadMap(){

      this.map = L.map('mapid', {
      center: {lat :18.201369, lng:-67.1395037},
      zoom: 13
    });
    

    //Add OSM Layer
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .addTo(this.map);
      this.loadRoute();
      this.getStops();  
 
  }
  //method to call backend and retrieved stop information from route, once information is
  //retrieved the method will call the loadStops method
  getStops(){
    //todo usar getStops con ruta especifica
    this.routes_stops_service.getStops().subscribe(response =>{
        var tempstops=response.stops;
        for(var i=0;i<tempstops.length;i++){
          if(tempstops[i].route_ID==this.route.route_ID){
            this.stops.push(tempstops[i])
          }
        }
        //center map on bus stop coordinates
        //this.centerMap(this.stops[0].stop_latitude,this.stops[0].stop_longitude);
        this.loadStops();
  })
}
//load route to map in the form of a polyline
loadRoute(){
  var polylineOptions = {
               color: this.route.color,
               weight: 6,
               opacity: 1.0
             };

  var polyline = new L.Polyline(this.route.path, polylineOptions);
  polyline.addTo(this.map)
  
  //route popup content
  let content= "<h4>"+this.route.route_name+"</h4><p>"+this.route.route_description+"</p>"
  polyline.bindPopup(content)
  this.map.fitBounds(polyline.getBounds());
}
//method to load stops onto map
loadStops(){
    
    for(var i=0;i<this.stops.length;i++){
       
       this.addStop(this.stops[i])          
      
    }
  
}
//add stop marker with pop up
addStop(stop){
   var coords={lat:stop.stop_latitude,lng:stop.stop_longitude}
   let content = "<h4>"+stop.stop_name+"</h4><p>"+stop.stop_description+"</p>";
   let marker=L.marker(coords).bindPopup(content); 
   this.map.addLayer(marker);
}
//center map to the given latitude and longitude
centerMap(latitude,longitude){
   let latLng = {lat:latitude,lng:longitude};
   this.map.panTo(latLng);
}
//center map relative to bus top coordinate
centerStop(stop){
  //todo highlight stop!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //erase nearby stop marker if already created
    //erase location marker if already created
    //erase highlight stop if created
    if(this.locationMarker!=null){
      this.map.removeLayer(this.locationMarker)
      this.locationMarker=null;
    }
    if(this.nearbyStopMarker!=null){
      this.map.removeLayer(this.nearbyStopMarker)
      this.nearbyStopMarker=null;
    }
    if(this.tempStopMarker!=null){
      this.map.removeLayer(this.tempStopMarker)
      this.tempStopMarker=null;
    }
    let latLng = {lat:stop.stop_latitude,lng:stop.stop_longitude};    
    let content = "<h4>"+stop.stop_name+"</h4><p>"+stop.stop_description+"</p>";
    this.tempStopMarker=L.marker(latLng).bindPopup(content); 
    this.map.addLayer(this.tempStopMarker);
    this.tempStopMarker.openPopup();
    this.map.setView(latLng,15);
    
}
//calculate the nearest bus stop with respect to the users location
nearbyStop(){ 
    //erase nearby stop marker if already created
    //erase location marker if already created
    //erase highlight stop if created
    if(this.locationMarker!=null){
      this.map.removeLayer(this.locationMarker)
      this.locationMarker=null;
    }
    if(this.nearbyStopMarker!=null){
      this.map.removeLayer(this.nearbyStopMarker)
      this.nearbyStopMarker=null;
    }
    if(this.tempStopMarker!=null){
      this.map.removeLayer(this.tempStopMarker)
      this.tempStopMarker=null;
    }
    //get users location
    Geolocation.getCurrentPosition().then((myposition) => {
        //coordinates
        let latitude=myposition.coords.latitude;
        let longitude=myposition.coords.longitude;
        let latLng={lat:latitude,lng:longitude}

        //set up marker with pop up and add to map
        let content = "<h4>Your Location!</h4>";
        this.locationMarker= new L.Marker(latLng)
        this.locationMarker.bindPopup(content);
        this.map.addLayer(this.locationMarker)
       
        //get nearbystop coordinates
        let nearbyStopCoordinates= this.getShortestDistance(latitude, longitude);
        console.log("nearby coordinates",nearbyStopCoordinates)

        //set up nearby stop marker with pop up onto map
        let nearbyLatLng={lat:nearbyStopCoordinates.stop_latitude,lng:nearbyStopCoordinates.stop_longitude}
        let content1 = "<h4>NearbyStop</h4>";
        this.nearbyStopMarker= new L.Marker(nearbyLatLng)
        this.map.addLayer(this.nearbyStopMarker)
        this.nearbyStopMarker.bindPopup(content1).openPopup()
        

        this.map.fitBounds([[nearbyLatLng.lat,nearbyLatLng.lng],[latitude,longitude]]);
       }, (err) => {
         //if location is not enable present this alert
         this.presentAlert('Location not enable','Please go to location settings and enable location')
    });
 
}
//method to find the closest bus stop with respect to users location
getShortestDistance(lat,lng){
  var shortestDistance=10e10
  var closestCoordinates={stop_latitude:0,stop_longitude:0}
  //calculate harvesine distance for each stop and filter out the shortest distance
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
//using the latitudes and longitudes of the two points
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
//change from degrees to radians
toRad(degrees) {
    return degrees * Math.PI / 180;
}
//method to present alert to user using ionics alert controller
presentAlert(title,subTitle){
let alert = this.alertCtrl.create({
                title: title,
                subTitle: subTitle,
                buttons: ['Dismiss']
              });
alert.present();
}

}
