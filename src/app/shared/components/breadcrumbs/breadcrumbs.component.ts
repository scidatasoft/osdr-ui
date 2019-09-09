import {Component, Input, OnChanges, OnInit, Optional, SimpleChanges} from '@angular/core';
import {BrowserDataBaseService} from 'app/core/services/browser-services/browser-data-base.service';

@Component({
  selector: 'dr-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit, OnChanges {

  @Input() items: { text: string, width: number, link: string }[];
  constructor(@Optional() private dataService: BrowserDataBaseService) { }

  ngOnInit() {
  }

  getBreadCrumbs() {
    if (this.dataService && this.dataService.getBreadCrumbs()) {
      return this.items = this.dataService.getBreadCrumbs();
    } else {
      return this.items;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const mainWidth = 30;
    const otherWidth = (100 - mainWidth) / changes.items.currentValue.length - 1;
    for (let i = 0; i < changes.items.currentValue.length - 1; i++) {
      const item = changes.items.currentValue[i];
      item.width = otherWidth + '%';
    }
    const lastItem = changes.items.currentValue[changes.items.currentValue.length - 1];
    if (lastItem) {
      lastItem.width = mainWidth + '%';
    }
  }
}
