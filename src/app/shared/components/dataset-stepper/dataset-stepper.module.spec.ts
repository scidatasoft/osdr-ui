import { DatasetStepperModule } from './dataset-stepper.module';

describe('DatasetStepperModule', () => {
  let datasetStepperModule: DatasetStepperModule;

  beforeEach(() => {
    datasetStepperModule = new DatasetStepperModule();
  });

  it('should create an instance', () => {
    expect(datasetStepperModule).toBeTruthy();
  });
});
