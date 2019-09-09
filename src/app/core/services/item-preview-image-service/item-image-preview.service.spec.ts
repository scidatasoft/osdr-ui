import { TestBed, inject } from '@angular/core/testing';

import { ItemImagePreviewService } from './item-image-preview.service';

describe('ItemImagePreviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemImagePreviewService],
    });
  });

  it('should be created', inject([ItemImagePreviewService], (service: ItemImagePreviewService) => {
    expect(service).toBeTruthy();
  }));
});
