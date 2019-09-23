import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class PageTitleService {
  set title(value: string) {
    document.title = `${value} - Leanda`;
  }
}
