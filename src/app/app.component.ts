import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { environment } from '../environments/environment';

@Component({
  selector: 'dr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {
    router.events.subscribe((val) => this.routeChanges(val));

    // document.title += ' - ' + environment.name;

    // Capture router events and forward them to Google Analytics
    // ** Replace "UA-*********-*" with your personal GA tag after adding GA to application

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     (<any>window).gtag('config', 'UA-*********-*', {
    //       'page_title' : document.title,
    //       'page_path': event.url
    //     });
    //   }
    // });
  }

  routeChanges(val: any) {

  }
}
