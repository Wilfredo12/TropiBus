import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import { RoutesStopsService } from '../../providers/routes-stops-service';
import L from "leaflet";


@Component({
  selector: 'maps-Overview',
  templateUrl: 'mapOverview.html'
})
export class MapOverviewPage {


  map: any;
  routes:any;
  stops:any;
  tempRoute:any;
  locationMarker:any;
  polylinePaths:any;
  layer:any;
  active:number;

  constructor(public navCtrl: NavController,public routes_stops_service:RoutesStopsService, public alertCtrl:AlertController) {
    
  }
//method that runs when page is intialized
ngOnInit(){
    //todo checkInternet connection
    this.active=2
    this.loadMap();
    this.routes=[]
    this.polylinePaths=[]
  }

//this method load the leaflet container with the openstreetmap maps layer
loadMap(){
      var latlng={lat:18.2013257,lng:-67.1392801}
      //create map container
      this.map = L.map('mapid1', {
        center: latlng,
        zoom: 15
      });

       //Add Open street map Layer
     L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .addTo(this.map);
      this.getRoutes();

     //get users location if enable
     //this.myLocation()
    
  }

  //this method makes a request to the backend to retrieve information from the routes of
  //the TIM system, once routes are retrieved we call the loadRoutes method to load the routes
  //onto the map
  getRoutes(){
    this.routes_stops_service.getRoutes().subscribe(response =>{
        this.routes=response.routes;
        this.loadRoutes();
        console.log(response)
  })
  }
  //this method load route's paths onto map
  loadRoutes(){
    //for each route in the city
    for(var i=0;i<this.routes.length;i++){
        var route=this.routes[i];
        if(route.route_area=="city"){
          //create polyline options
          var polylineOptions = {
               color: route.color,
               weight: 6,
               opacity: 1.0
             };
             //create polyline with pop up
            var polyline = new L.Polyline(route.path, polylineOptions);
            //add polyline to map
            polyline.addTo(this.map)
            let content= "<h4>"+route.route_name+"</h4><p>"+route.route_description+"</p>"
            //add popup to polyline
            polyline.bindPopup(content)
            this.polylinePaths.push(polyline)
            this.setHighLights();
        }
      }
  }
  

  //this method erases all the routes on the map and then populates the map with the routes corresponding
  //to the city or urban area of mayaguez
  city(){
      this.setActive(2)
      this.map.setView({lat:18.2013257,lng:-67.1392801},15);
      //erase all routes from map
      for(var i=0;i<this.polylinePaths.length;i++){
      this.map.removeLayer(this.polylinePaths[i]);
    }
    this.polylinePaths=[]
    //populate map with city routes
    this.loadRoutes()

  }
//this method erases all the routes on the map and then populates the map with the routes corresponding
  //to the rutal area of mayaguez
  rural(){
    this.setActive(1);
    this.map.setView({lat:18.2047609,lng:-67.1385972},15);
    //erase all routes from map
    for(var i=0;i<this.polylinePaths.length;i++){
      this.map.removeLayer(this.polylinePaths[i]);
    }
    this.polylinePaths=[]
    //filter rural routes
    for(var i=0;i<this.routes.length;i++){
        var route=this.routes[i];
        if(route.route_area=="rural"){
          console.log(route)
          var polylineOptions = {
               color: route.color,
               weight: 6,
               opacity: 1.0
             };
             //create polyline with popup for each route
            var polyline = new L.Polyline(route.path, polylineOptions);
            //add polyline to map
            polyline.addTo(this.map);            
            let content= "<h4>"+route.route_name+"</h4><p>"+route.route_description+"</p>"
            //add popup to polylin
            polyline.bindPopup(content)
            //keep track of routes added to map
            this.polylinePaths.push(polyline)
            //set highlights listerners
            this.setHighLights();
        }
      }
      //fit bounds of map to last polyline added to map
      this.map.fitBounds(this.polylinePaths[this.polylinePaths.length-1].getBounds());

  }
  //this method erases all the routes on the map and then populates the map with the routes corresponding
  //to the litoral or coastal area of mayaguez
  litoral(){
    this.setActive(3);
    this.map.setView({lat:18.2047609,lng:-67.1385972},15);
    //erase all routes from map
    for(var i=0;i<this.polylinePaths.length;i++){
      this.map.removeLayer(this.polylinePaths[i]);
    }
    this.polylinePaths=[]
    //filter routes from litoral or coastal areas
    for(var i=0;i<this.routes.length;i++){
        var route=this.routes[i];
        if(route.route_area=="litoral"){
           console.log(route)
           //setting up polyline options
            var polylineOptions = {
                  color: route.color,
                  weight: 6,
                  opacity: 1.0
                };
                //create polyline with popup for each litoral route
                var polyline = new L.Polyline(route.path, polylineOptions);
                //adding polyline to maps
                polyline.addTo(this.map);
                let content= "<h4>"+route.route_name+"</h4><p>"+route.route_description+"</p>"
                //adding popup to polyline
                polyline.bindPopup(content);
                //keep track of al polylines with polylinePaths array
                this.polylinePaths.push(polyline)
                this.setHighLights();
        }
        
      }
      //fit bounds of map to last polyline added
      this.map.fitBounds(this.polylinePaths[this.polylinePaths.length-1].getBounds());
  }

  //event listener to highlight routes when pressed
  setHighLights(){
    for(var i=0;i<this.polylinePaths.length;i++){
    let polyLine=this.polylinePaths[i];
    //when polyline is click is weight is increased
    polyLine.on('click', function(e) {
      var layer = e.target;

      layer.setStyle({
          weight: 7
      });
      //bring polyline to front of map
      layer.bringToFront();
      
    });
    //when users click somewhere else on the map polyline returns to its initial state
      polyLine.on('mouseout', function(e) { 
        var layer = e.target;
        layer.setStyle({
          weight: 6
        });
        //layer.bringToBack();
      })
  }
}

//gets the location of the user and add a marker in that location
//if location services are not on, an alert will pop up 
  myLocation(){
    //erase location marker if created
    console.log("entre a cojer mi location")
    if(this.locationMarker!=null){
      this.map.removeLayer(this.locationMarker);
    }

    if (!Geolocation || !Geolocation.watchPosition) {
        this.presentAlert("Location not available","Go to settings and enable location");
      }
    //get users location
    Geolocation.getCurrentPosition().then((myposition) => {
        let latLng = {lat:myposition.coords.latitude,lng: myposition.coords.longitude};
        //set up marker with popup onto map
        let content = "<h4>Your Location!</h4>";
        this.locationMarker=new L.Marker(latLng)
        //add location marker to map
        this.map.addLayer(this.locationMarker)
        //add popup to location marker and display popup on map
        this.locationMarker.bindPopup(content).openPopup() 
             

        this.map.setView(latLng,15);
       }, (err) => {
         //show alert if location is not enable on user's mobile phone
         this.presentAlert('Location not enable','Please go to location settings and enable location')
    });
  }
  //method to present alert to user
  presentAlert(title,subtitle){
    let alert = this.alertCtrl.create({
            title: title,
            subTitle: subtitle,
            buttons: ['Dismiss']
          });
    alert.present();
  }
  //this function is used to set which type of routes are active
  //1 for rural area, 2 for city, and 3 for litoral area 
  setActive(active){
    this.active=active;
  }
  //if "active" variable is 1 the color of the button rural is colored blue,
  //if "active" variable is 2 the color of the button city is colored blue,
  //if "active" variable is 3 the color of the button litoral is colored blue,
  //if "active" is not equal to the specified value the button will be colored black 
  getActive(status){
    if(this.active==status){
      return "tropiBlue"
    }
    else return "dark"
  }


}
