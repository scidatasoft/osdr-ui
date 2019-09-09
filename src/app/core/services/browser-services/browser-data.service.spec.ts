import {TestBed, inject} from '@angular/core/testing';

import {BrowserDataService} from './browser-data.service';

describe('BrowserDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrowserDataService],
    });
  });

  it('should be created', inject([BrowserDataService], (service: BrowserDataService) => {
    expect(service).toBeTruthy();
  }));
});
