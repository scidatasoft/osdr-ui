import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { AboutPageRoutingModule } from './about-page-routing.module';
import { AboutPageComponent } from './about-page.component';
import { AboutPageService } from './about-page.service';
import { FvcAboutComponent } from './distributions/fvc.component';
import { LabwizAboutComponent } from './distributions/labwiz.component';
import { LeandaAboutComponent } from './distributions/leanda.component';

const components = [FvcAboutComponent, LeandaAboutComponent, LabwizAboutComponent];

const cdk = [PortalModule];

@NgModule({
  imports: [MatCardModule, AboutPageRoutingModule, ...cdk],
  exports: [],
  declarations: [AboutPageComponent, ...components],
  providers: [AboutPageService],
  entryComponents: [...components],
})
export class AboutPageModule {}
