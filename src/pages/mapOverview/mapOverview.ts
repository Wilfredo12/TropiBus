import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import { RoutesStopsService } from '../../providers/routes-stops-service';
import { ConnectivityService } from '../../providers/connectivity-service';

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
  routes_stops_service:any;
  tempRoute:any;
 
  constructor(public navCtrl: NavController,routes_stops_service:RoutesStopsService) {
    this.routes_stops_service=routes_stops_service;
    
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
      this.getRoutes();
 
    }, (err) => {
      console.log(err);
    });
  
  }

  getRoutes(){
    this.routes_stops_service.getRoutes().subscribe(response =>{
        this.routes=response.routes;
        this.loadRoutes();
        console.log(response)
  })
  }

  loadRoutes(){

    for(var i=0;i<this.routes.length;i++){
      var route=this.routes[i];
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
    }
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
        this.map.panTo(latLng);
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
