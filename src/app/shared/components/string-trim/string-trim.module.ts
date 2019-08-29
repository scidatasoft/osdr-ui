import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StringTrimComponent } from './string-trim.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [StringTrimComponent],
  exports: [StringTrimComponent],
  imports: [
    CommonModule,
    MatTooltipModule
  ]
})
export class StringTrimModule { }
