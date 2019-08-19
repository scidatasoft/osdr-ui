import { NgModule } from '@angular/core';

import { CommonModulesList } from 'app/common-modules-list';
import { ImportWebPageComponent } from './import-web-page.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonModule, MatFormFieldModule, MatDialogModule } from '@angular/material';

const MatModules = [
  MatFormFieldModule,
  MatDialogModule
];

@NgModule({
  imports: [SharedModule, ...MatModules],
  exports: [ImportWebPageComponent],
  declarations: [ImportWebPageComponent],
  providers: [],
  entryComponents: [ImportWebPageComponent]
})
export class ImportWebPageModule { }

