import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {RedditService} from './services/reddits.service';
import { TabsPage } from '../pages/tabs/tabs';
import { MapOverviewPage } from '../pages/mapOverview/mapOverview';
import { Routes_StopsPage } from '../pages/routes&stops/routes&stops';
import { RoutePage } from '../pages/route/route';
import { RoutesStopsService } from '../providers/routes-stops-service';



@Component({
  templateUrl: 'app.html',
  providers: [RedditService,RoutesStopsService]
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
