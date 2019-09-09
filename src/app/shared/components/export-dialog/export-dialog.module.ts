import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { StringTrimModule } from '../string-trim/string-trim.module';

import { ExportDialogComponent } from './export-dialog.component';

const MatModules = [
  MatExpansionModule,
  MatDialogModule,
  MatListModule,
  MatSlideToggleModule,
];

@NgModule({
  imports: [SharedModule, ...MatModules, StringTrimModule],
  exports: [ExportDialogComponent],
  declarations: [ExportDialogComponent],
  providers: [],
  entryComponents: [ExportDialogComponent],
})
export class ExportDialogModule { }
