import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { FilterBarComponent } from './filter-bar.component';

@NgModule({
  imports: [SharedModule],
  exports: [FilterBarComponent],
  declarations: [FilterBarComponent],
  providers: [],
})
export class FilterBarModule { }
