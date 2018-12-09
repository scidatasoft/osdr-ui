import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { BreadcrumbsComponent } from './breadcrumbs.component';

@NgModule({
  imports: [...CommonModulesList, SharedModule],
  exports: [BreadcrumbsComponent],
  declarations: [BreadcrumbsComponent],
  providers: [],
})
export class BreadcrumbsModule { }
