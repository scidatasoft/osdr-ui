import { ChemEditorModule } from './chem-editor.module';

describe('ChemEditorModule', () => {
  let chemEditorModule: ChemEditorModule;

  beforeEach(() => {
    chemEditorModule = new ChemEditorModule();
  });

  it('should create an instance', () => {
    expect(chemEditorModule).toBeTruthy();
  });
});
