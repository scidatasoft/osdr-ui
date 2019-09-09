import { TestBed, inject } from '@angular/core/testing';

import { FingerprintsService } from './fingerprints.service';

describe('FingerprintsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FingerprintsService],
    });
  });

  it('should be created', inject([FingerprintsService], (service: FingerprintsService) => {
    expect(service).toBeTruthy();
  }));
});
