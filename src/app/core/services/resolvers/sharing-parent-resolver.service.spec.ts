import { TestBed, inject } from '@angular/core/testing';

import { SharingParentResolverService } from './sharing-parent-resolver.service';

describe('SharingParentResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharingParentResolverService]
    });
  });

  it('should be created', inject([SharingParentResolverService], (service: SharingParentResolverService) => {
    expect(service).toBeTruthy();
  }));
});
