import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared.module';

import { FilterBarComponent } from './filter-bar.component';

@NgModule({
  imports: [SharedModule, FormsModule],
  exports: [FilterBarComponent],
  declarations: [FilterBarComponent],
  providers: [],
})
export class FilterBarModule { }
