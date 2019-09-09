import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { PropertiesInfoBoxModule } from 'app/shared/components/properties-info-box/properties-info-box.module';
import { SharedModule } from 'app/shared/shared.module';

import { GenericMetadataPreviewModule } from '../generic-metadata-preview/generic-metadata-preview.module';

import { CifPreviewComponent } from './cif-preview/cif-preview.component';
import { CSVPreviewComponent } from './csv-preview/csv-preview.component';
import { ImageFileViewComponent } from './image-file-view/image-file-view.component';
import { MicroscopyViewComponent } from './microscopy-view/microscopy-view.component';
import { OfficePreviewComponent } from './office-preview/office-preview.component';
import { PdfFileViewComponent } from './pdf-file-view/pdf-file-view.component';
import { SavFileViewComponent } from './sav-file-view/sav-file-view.component';
import { SpectraJsmolPreviewComponent } from './spectra-jsmol-preview/spectra-jsmol-preview.component';

const components = [
  CifPreviewComponent,
  CSVPreviewComponent,
  ImageFileViewComponent,
  OfficePreviewComponent,
  PdfFileViewComponent,
  SpectraJsmolPreviewComponent,
  SavFileViewComponent,
  MicroscopyViewComponent,
];

@NgModule({
  imports: [PropertiesInfoBoxModule, SharedModule, GenericMetadataPreviewModule],
  exports: [...components],
  declarations: [...components],
  providers: [],
})
export class FileViewsModule {}
