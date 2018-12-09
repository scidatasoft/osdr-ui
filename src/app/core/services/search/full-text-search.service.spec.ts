import { TestBed, inject } from '@angular/core/testing';

import { FullTextSearchService } from './full-text-search.service';

describe('FullTextSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FullTextSearchService]
    });
  });

  it('should be created', inject([FullTextSearchService], (service: FullTextSearchService) => {
    expect(service).toBeTruthy();
  }));
});
