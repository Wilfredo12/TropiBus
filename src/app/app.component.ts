import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { RoutesStopsService } from '../providers/routes-stops-service';
import { BusLocation } from '../providers/bus-location';
import { Messages } from '../providers/messages';



@Component({
  templateUrl: 'app.html',
  providers: [RoutesStopsService,Messages,BusLocation]
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
