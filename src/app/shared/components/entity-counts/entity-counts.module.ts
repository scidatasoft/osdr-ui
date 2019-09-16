import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuickFilterService } from 'app/core/services/browser-services/quick-filter.service';
import { SharedModule } from 'app/shared/shared.module';

import { EntityCountsComponent } from './entity-counts.component';
import { EntityCountsService } from './entity-counts.service';

const MatModules = [MatFormFieldModule, MatTooltipModule, MatRippleModule];

@NgModule({
  imports: [SharedModule, ...MatModules],
  exports: [EntityCountsComponent],
  declarations: [EntityCountsComponent],
  providers: [QuickFilterService, EntityCountsService],
})
export class EntityCountsModule {}
