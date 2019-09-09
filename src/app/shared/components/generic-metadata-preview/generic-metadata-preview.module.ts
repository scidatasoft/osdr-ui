import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { PropertiesInfoBoxModule } from '../properties-info-box/properties-info-box.module';

import { GenericMetadataPreviewComponent } from './generic-metadata-preview.component';

@NgModule({
  declarations: [GenericMetadataPreviewComponent],
  exports: [GenericMetadataPreviewComponent],
  imports: [
    CommonModule,
    MatCardModule,
    PropertiesInfoBoxModule,
  ],
})
export class GenericMetadataPreviewModule { }
