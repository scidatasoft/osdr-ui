import { Injectable } from '@angular/core';

@Injectable()
export class SidebarContentService {

  get sidebarCollapsed() { return localStorage.getItem('sidebarCollapsed') === 'true'; }
  set sidebarCollapsed(value: boolean) { localStorage.setItem('sidebarCollapsed', value.toString()); }

  constructor() { }

}
