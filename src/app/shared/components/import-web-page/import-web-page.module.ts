import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { ImportWebPageComponent } from './import-web-page.component';

const MatModules = [
  MatFormFieldModule,
  MatDialogModule,
];

@NgModule({
  imports: [SharedModule, ...MatModules],
  exports: [ImportWebPageComponent],
  declarations: [ImportWebPageComponent],
  providers: [],
  entryComponents: [ImportWebPageComponent],
})
export class ImportWebPageModule { }
