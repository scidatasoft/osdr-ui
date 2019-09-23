import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { PageTitleService } from 'app/core/services/page-title/page-title.service';
import { environment } from 'environments/environment';

import { AboutPageService } from './about-page.service';
import { FvcAboutComponent } from './distributions/fvc.component';
import { LabwizAboutComponent } from './distributions/labwiz.component';
import { LeandaAboutComponent } from './distributions/leanda.component';

@Component({
  selector: 'dr-about',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent implements OnInit {
  selectedPortal: ComponentPortal<Component>;

  constructor(private pageTitle: PageTitleService, private service: AboutPageService) {
    pageTitle.title = 'About';
  }

  ngOnInit() {
    this.setComponent();
  }

  private setComponent() {
    const mockDistribution = environment.distribution;
    switch (mockDistribution.code) {
      case 'labwiz':
        this.service.componentPortal = this.selectedPortal = new ComponentPortal<LabwizAboutComponent>(LabwizAboutComponent);
        break;
      case 'fvc':
        this.service.componentPortal = this.selectedPortal = new ComponentPortal<FvcAboutComponent>(FvcAboutComponent);
        break;

      default:
        this.service.componentPortal = this.selectedPortal = new ComponentPortal<LeandaAboutComponent>(LeandaAboutComponent);
        break;
    }
  }
}
