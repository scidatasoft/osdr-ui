import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { ExportDialogComponent } from './export-dialog.component';

@NgModule({
  imports: [SharedModule, ...CommonModulesList],
  exports: [ExportDialogComponent],
  declarations: [ExportDialogComponent],
  providers: [],
  entryComponents: [ExportDialogComponent],
})
export class ExportDialogModule { }
