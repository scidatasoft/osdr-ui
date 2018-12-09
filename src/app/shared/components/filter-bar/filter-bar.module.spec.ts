import { FilterBarModule } from './filter-bar.module';

describe('FilterBarModule', () => {
  let filterBarModule: FilterBarModule;

  beforeEach(() => {
    filterBarModule = new FilterBarModule();
  });

  it('should create an instance', () => {
    expect(filterBarModule).toBeTruthy();
  });
});
