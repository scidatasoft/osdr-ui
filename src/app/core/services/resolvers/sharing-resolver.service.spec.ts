import { TestBed, inject } from '@angular/core/testing';

import {SharingResolver} from './sharing-resolver.service';


describe('ShareResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharingResolver]
    });
  });

  it('should be created', inject([SharingResolver], (service: SharingResolver) => {
    expect(service).toBeTruthy();
  }));
});
