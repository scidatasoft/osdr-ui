import { Component, OnInit } from '@angular/core';

import { SidebarContentService } from './sidebar-content.service';

@Component({
  selector: 'dr-sidebar-content',
  templateUrl: './sidebar-content.component.html',
  styleUrls: ['./sidebar-content.component.scss'],
})
export class SidebarContentComponent implements OnInit {

  get sidebarCollapsed() {
    return this.sidebarContenService.sidebarCollapsed;
  }

  set sidebarCollapsed(value) {
    this.sidebarContenService.sidebarCollapsed = value;
  }

  constructor(public sidebarContenService: SidebarContentService) { }

  ngOnInit() {
  }

}
