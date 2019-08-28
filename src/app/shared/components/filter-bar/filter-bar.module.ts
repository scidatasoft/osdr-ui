import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { FilterBarComponent } from './filter-bar.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [SharedModule, FormsModule],
  exports: [FilterBarComponent],
  declarations: [FilterBarComponent],
  providers: [],
})
export class FilterBarModule { }
