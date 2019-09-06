import { NgModule } from '@angular/core';
import { UploadInfoBoxComponent } from './upload-info-box.component';
import { SharedModule } from '../../shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [SharedModule, MatTooltipModule],
  exports: [UploadInfoBoxComponent],
  declarations: [UploadInfoBoxComponent],
  providers: []
})
export class UploadInfoBoxModule {}
