import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { NotificationsModule } from 'app/shared/components/notifications/notifications.module';
import { SharedModule } from 'app/shared/shared.module';

import { FvcHomeComponent } from './distributions/fvc/fvc.component';
import { LabwizHomeComponent } from './distributions/labwiz/labwiz.component';
import { LeandaHomeComponent } from './distributions/leanda/leanda.component';
import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent } from './home-page.component';
import { HomePageService } from './home-page.service';

const components = [LeandaHomeComponent, FvcHomeComponent, LabwizHomeComponent];

const cdk = [PortalModule];

@NgModule({
  imports: [SharedModule, NotificationsModule, HomePageRoutingModule, ...cdk],
  exports: [],
  declarations: [HomePageComponent, ...components],
  providers: [HomePageService],
  entryComponents: [...components],
})
export class HomePageModule {}
