import { Injectable } from '@angular/core';
import { ESidebarTab } from 'app/views/organize-view/organize-view.model';

@Injectable()
export class SidebarContentService {
  get sidebarCollapsed() {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  }
  set sidebarCollapsed(value: boolean) {
    localStorage.setItem('sidebarCollapsed', value.toString());
  }

  get sidebarTab(): number {
    return Number(localStorage.getItem('sidebarTab'));
  }

  set sidebarTab(value: number) {
    localStorage.setItem('sidebarTab', value.toString());
  }
}
