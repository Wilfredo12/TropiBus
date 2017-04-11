import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { TabsPage } from '../pages/tabs/tabs';
import { MapOverviewPage } from '../pages/mapOverview/mapOverview';
import { Routes_StopsPage } from '../pages/routes&stops/routes&stops';
import { RoutePage } from '../pages/route/route';
import { RoutesStopsService } from '../providers/routes-stops-service';
import { BusLocation } from '../providers/bus-location';
import { Messages } from '../providers/messages';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    Routes_StopsPage,
    RoutePage,
    MapOverviewPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    Routes_StopsPage,
    RoutePage,
    MapOverviewPage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},BusLocation,RoutesStopsService,Messages]
})
export class AppModule {}
