import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AboutPageRoutingModule } from './about-page-routing.module';

import { AboutPageComponent } from './about-page.component';

@NgModule({
  imports: [MatCardModule, AboutPageRoutingModule],
  exports: [],
  declarations: [AboutPageComponent],
  providers: [],
})
export class AboutPageModule { }
