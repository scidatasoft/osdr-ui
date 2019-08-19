import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { EntityCountsComponent } from './entity-counts.component';
import { MatFormFieldModule, MatTooltipModule } from '@angular/material';

const MatModules = [
  MatFormFieldModule,
  MatTooltipModule
];

@NgModule({
  imports: [SharedModule, ...MatModules],
  exports: [EntityCountsComponent],
  declarations: [EntityCountsComponent],
  providers: [],
})
export class EntityCountsModule { }
