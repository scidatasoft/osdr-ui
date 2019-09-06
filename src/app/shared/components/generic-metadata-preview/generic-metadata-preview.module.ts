import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericMetadataPreviewComponent } from './generic-metadata-preview.component';
import { MatCardModule } from '@angular/material/card';
import { PropertiesInfoBoxModule } from '../properties-info-box/properties-info-box.module';

@NgModule({
  declarations: [GenericMetadataPreviewComponent],
  exports: [GenericMetadataPreviewComponent],
  imports: [
    CommonModule,
    MatCardModule,
  PropertiesInfoBoxModule
  ]
})
export class GenericMetadataPreviewModule { }
