import { TestBed, inject } from '@angular/core/testing';

import { MachineLearningService } from './machine-learning.service';

describe('MachineLearningService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MachineLearningService],
    });
  });

  it('should be created', inject([MachineLearningService], (service: MachineLearningService) => {
    expect(service).toBeTruthy();
  }));
});
