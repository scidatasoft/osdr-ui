import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { PropertiesInfoBoxModule } from 'app/shared/components/properties-info-box/properties-info-box.module';

import { CifPreviewComponent } from './cif-preview/cif-preview.component';
import { CSVPreviewComponent } from './csv-preview/csv-preview.component';
import { ImageFileViewComponent } from './image-file-view/image-file-view.component';
import { OfficePreviewComponent } from './office-preview/office-preview.component';
import { PdfFileViewComponent } from './pdf-file-view/pdf-file-view.component';
import { SpectraJsmolPreviewComponent } from './spectra-jsmol-preview/spectra-jsmol-preview.component';
import { SavFileViewComponent } from './sav-file-view/sav-file-view.component';

const components = [
  CifPreviewComponent,
  CSVPreviewComponent,
  ImageFileViewComponent,
  OfficePreviewComponent,
  PdfFileViewComponent,
  SpectraJsmolPreviewComponent,
  SavFileViewComponent
];

@NgModule({
  imports: [PropertiesInfoBoxModule, ...CommonModulesList, SharedModule],
  exports: [...components],
  declarations: [...components],
  providers: [],
})
export class FileViewsModule { }
