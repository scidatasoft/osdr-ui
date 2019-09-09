import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { PropertiesInfoBoxComponent } from './properties-info-box.component';

@NgModule({
  imports: [SharedModule, MatExpansionModule],
  exports: [PropertiesInfoBoxComponent],
  declarations: [PropertiesInfoBoxComponent],
  providers: [],
})
export class PropertiesInfoBoxModule { }
