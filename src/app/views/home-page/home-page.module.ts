import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HomePageRoutingModule } from './home-page-routing.module';


import { NotificationsModule } from 'app/shared/components/notifications/notifications.module';
import { HomePageComponent } from './home-page.component';



@NgModule({
  imports: [SharedModule, NotificationsModule, HomePageRoutingModule],
  exports: [],
  declarations: [HomePageComponent],
  providers: [],
})
export class HomePageModule { }
