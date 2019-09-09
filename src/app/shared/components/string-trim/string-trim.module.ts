import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { StringTrimComponent } from './string-trim.component';

@NgModule({
  declarations: [StringTrimComponent],
  exports: [StringTrimComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
  ],
})
export class StringTrimModule { }
