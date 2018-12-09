import {TestBed, inject} from '@angular/core/testing';
import {BrowserDataFileService} from './browser-data-file.service';

describe('BrowserDataFileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrowserDataFileService]
    });
  });

  it('should be created', inject([BrowserDataFileService], (service: BrowserDataFileService) => {
    expect(service).toBeTruthy();
  }));
});
