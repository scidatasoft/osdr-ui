import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { ExportDialogComponent } from './export-dialog.component';
import { MatButtonModule, MatExpansionModule, MatDialogModule, MatListModule, MatSlideToggleModule } from '@angular/material';
import { StringTrimModule } from '../string-trim/string-trim.module';

const MatModules = [
  MatExpansionModule,
  MatDialogModule,
  MatListModule,
  MatSlideToggleModule
];

@NgModule({
  imports: [SharedModule, ...MatModules, StringTrimModule],
  exports: [ExportDialogComponent],
  declarations: [ExportDialogComponent],
  providers: [],
  entryComponents: [ExportDialogComponent],
})
export class ExportDialogModule { }
