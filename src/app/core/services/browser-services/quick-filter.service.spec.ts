import { TestBed, inject } from '@angular/core/testing';

import { QuickFilterService } from './quick-filter.service';

describe('QuickFilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuickFilterService],
    });
  });

  it('should be created', inject([QuickFilterService], (service: QuickFilterService) => {
    expect(service).toBeTruthy();
  }));
});
