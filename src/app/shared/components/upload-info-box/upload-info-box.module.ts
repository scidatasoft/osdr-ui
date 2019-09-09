import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedModule } from '../../shared.module';

import { UploadInfoBoxComponent } from './upload-info-box.component';

@NgModule({
  imports: [SharedModule, MatTooltipModule],
  exports: [UploadInfoBoxComponent],
  declarations: [UploadInfoBoxComponent],
  providers: [],
})
export class UploadInfoBoxModule {}
