import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { SharedLinksComponent } from './shared-links.component';

@NgModule({
  imports: [SharedModule],
  exports: [SharedLinksComponent],
  declarations: [SharedLinksComponent],
  providers: [],
  entryComponents: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SharedLinksModule { }
