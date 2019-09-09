import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';

import { EntityCountsComponent } from './entity-counts.component';

const MatModules = [
  MatFormFieldModule,
  MatTooltipModule,
];

@NgModule({
  imports: [SharedModule, ...MatModules],
  exports: [EntityCountsComponent],
  declarations: [EntityCountsComponent],
  providers: [],
})
export class EntityCountsModule { }
