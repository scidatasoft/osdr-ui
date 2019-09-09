import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModulesList } from 'app/common-modules-list';
import { BreadcrumbsModule } from 'app/shared/components/breadcrumbs/breadcrumbs.module';
import { FullTextSearchModule } from 'app/shared/components/full-text-search-view/full-text-search-view.module';
import { SharedModule } from 'app/shared/shared.module';

import { OrganizeToolbarComponent } from './organize-toolbar.component';

@NgModule({
  imports: [SharedModule, BreadcrumbsModule, FullTextSearchModule, MatTooltipModule],
  exports: [OrganizeToolbarComponent],
  declarations: [OrganizeToolbarComponent],
  providers: [],
})
export class OrganizeToolbarModule { }
