import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { EntityCountsComponent } from './entity-counts.component';

@NgModule({
  imports: [...CommonModulesList, SharedModule],
  exports: [EntityCountsComponent],
  declarations: [EntityCountsComponent],
  providers: [],
})
export class EntityCountsModule { }
