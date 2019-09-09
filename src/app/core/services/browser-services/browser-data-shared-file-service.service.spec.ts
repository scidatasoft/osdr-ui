import { TestBed, inject } from '@angular/core/testing';

import { BrowserDataSharedFileServiceService } from './browser-data-shared-file-service.service';

describe('BrowserDataSharedFileServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrowserDataSharedFileServiceService],
    });
  });

  it('should be created', inject([BrowserDataSharedFileServiceService], (service: BrowserDataSharedFileServiceService) => {
    expect(service).toBeTruthy();
  }));
});
