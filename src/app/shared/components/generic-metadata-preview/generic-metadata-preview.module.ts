import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericMetadataPreviewComponent } from './generic-metadata-preview.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [GenericMetadataPreviewComponent],
  exports: [GenericMetadataPreviewComponent],
  imports: [
    CommonModule,
    MatCardModule
  ]
})
export class GenericMetadataPreviewModule { }
