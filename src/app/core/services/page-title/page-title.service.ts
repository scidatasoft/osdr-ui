import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class PageTitleService {

  set title(value) {
    document.title = value + ' - Leanda';
  }

  constructor() { }
}
