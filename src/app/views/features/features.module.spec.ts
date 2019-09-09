import { FeaturesModule } from './features.module';

describe('ChemicalFeaturesComputationModule', () => {
  let chemicalFeaturesComputationModule: FeaturesModule;

  beforeEach(() => {
    chemicalFeaturesComputationModule = new FeaturesModule();
  });

  it('should create an instance', () => {
    expect(chemicalFeaturesComputationModule).toBeTruthy();
  });
});
