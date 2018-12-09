import { NgModule } from '@angular/core';
import { UploadInfoBoxComponent } from './upload-info-box.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [SharedModule],
  exports: [UploadInfoBoxComponent],
  declarations: [UploadInfoBoxComponent],
  providers: [],
})
export class UploadInfoBoxModule { }
