import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).gtag('config', 'UA-124017517-2', {
          'page_title' : document.title,
          'page_path': event.url
        });
      }
    });
  }

  routeChanges(val: any) {

  }
}
