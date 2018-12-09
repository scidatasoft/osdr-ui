import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { FullTextSearchViewComponent } from './full-text-search-view.component';

@NgModule({
  imports: [...CommonModulesList, SharedModule],
  exports: [FullTextSearchViewComponent],
  declarations: [FullTextSearchViewComponent],
  providers: [],
})
export class FullTextSearchModule { }
