import { NgModule } from '@angular/core';

import { CommonModulesList } from 'app/common-modules-list';
import { ImportWebPageComponent } from './import-web-page.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [SharedModule, ...CommonModulesList],
  exports: [ImportWebPageComponent],
  declarations: [ImportWebPageComponent],
  providers: [],
  entryComponents: [ImportWebPageComponent]
})
export class ImportWebPageModule { }

