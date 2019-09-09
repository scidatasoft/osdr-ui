import { TestBed, inject } from '@angular/core/testing';

import { ActionViewService } from './action-view.service';

describe('ActionViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionViewService],
    });
  });

  it('should be created', inject([ActionViewService], (service: ActionViewService) => {
    expect(service).toBeTruthy();
  }));
});
