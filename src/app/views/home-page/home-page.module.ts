import { NgModule } from '@angular/core';
import { NotificationsModule } from 'app/shared/components/notifications/notifications.module';
import { SharedModule } from 'app/shared/shared.module';

import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent } from './home-page.component';

@NgModule({
  imports: [SharedModule, NotificationsModule, HomePageRoutingModule],
  exports: [],
  declarations: [HomePageComponent],
  providers: [],
})
export class HomePageModule { }
