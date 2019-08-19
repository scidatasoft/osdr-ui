import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { PropertiesInfoBoxComponent } from './properties-info-box.component';
import { MatExpansionModule } from '@angular/material';


@NgModule({
  imports: [SharedModule, MatExpansionModule],
  exports: [PropertiesInfoBoxComponent],
  declarations: [PropertiesInfoBoxComponent],
  providers: [],
})
export class PropertiesInfoBoxModule { }
