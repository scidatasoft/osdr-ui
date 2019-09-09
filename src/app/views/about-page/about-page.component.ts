import { Component, OnInit } from '@angular/core';
import { PageTitleService } from 'app/core/services/page-title/page-title.service';

@Component({
  selector: 'dr-about',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent implements OnInit {

  constructor(private pageTitle: PageTitleService) {
    pageTitle.title = 'About';
  }

  ngOnInit() {
  }

}
