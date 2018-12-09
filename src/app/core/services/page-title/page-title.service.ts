import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class PageTitleService {


  set title(value) {
    // const suffix = environment.production ? ' - OSDR' : ' - OSDR ' + environment.name;
  
    // document.title = value + suffix;
    document.title = value + ' - OSDR';

  }

  constructor() { }



}
