import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { PageTitleService } from 'app/core/services/page-title/page-title.service';

@Component({
  selector: 'dr-labwiz',
  template: `
    <div class="about-view">
      <div class="about-container">
        <mat-card>
          <h1>About LabWiz</h1>
          <p>
            <b>LabWiz</b> is a laboratory data collection, backup, indexing and annotation application. Based on Leanda.io, open source
            scientific data repository, data annotation, data processing and publishing platform.
          </p>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./labwiz.component.scss'],
})
export class LabwizComponent implements OnInit {
  constructor(private meta: Meta, private pageTitle: PageTitleService) {
    pageTitle.title = 'LabWiz - Laboratory Data Collection Application';
  }

  ngOnInit(): void {
    this.meta.addTag({
      name: 'keywords',
      content: 'labwiz, chemical, data, science',
    });
    this.meta.updateTag({
      name: 'description',
      content: `LabWiz is a laboratory data collection, backup, indexing and annotation application. Based on Leanda.io, open source
        scientific data repository, data annotation, data processing and publishing platform`,
    });
  }
}
