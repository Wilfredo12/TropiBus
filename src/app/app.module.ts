import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { RedditsPage } from '../pages/reddits/reddits';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { DetailsPage } from '../pages/details/details';
import { MapOverviewPage } from '../pages/mapOverview/mapOverview';
import { Routes_StopsPage } from '../pages/routes&stops/routes&stops';
import { RoutePage } from '../pages/route/route';
import { RoutesStopsService } from '../providers/routes-stops-service';
import { ConnectivityService } from '../providers/connectivity-service';
import { Messages } from '../providers/messages';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    RedditsPage,
    Routes_StopsPage,
    RoutePage,
    MapOverviewPage,
    DetailsPage,
    SettingsPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    RedditsPage,
    DetailsPage,
    Routes_StopsPage,
    RoutePage,
    MapOverviewPage,
    SettingsPage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},ConnectivityService,RoutesStopsService,Messages]
})
export class AppModule {}
