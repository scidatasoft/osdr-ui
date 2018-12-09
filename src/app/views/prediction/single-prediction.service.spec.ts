import { TestBed, inject } from '@angular/core/testing';

import { SinglePredictionService } from './single-prediction.service';

describe('SinglePredictionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SinglePredictionService]
    });
  });

  it('should be created', inject([SinglePredictionService], (service: SinglePredictionService) => {
    expect(service).toBeTruthy();
  }));
});
