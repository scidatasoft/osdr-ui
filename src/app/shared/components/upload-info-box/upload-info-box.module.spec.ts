import { UploadInfoBoxModule } from './upload-info-box.module';

describe('UploadInfoBoxModule', () => {
  let uploadInfoBoxModule: UploadInfoBoxModule;

  beforeEach(() => {
    uploadInfoBoxModule = new UploadInfoBoxModule();
  });

  it('should create an instance', () => {
    expect(uploadInfoBoxModule).toBeTruthy();
  });
});
