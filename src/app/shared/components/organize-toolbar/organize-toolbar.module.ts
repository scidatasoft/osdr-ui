import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { BreadcrumbsModule } from 'app/shared/components/breadcrumbs/breadcrumbs.module';
import { FullTextSearchModule } from 'app/shared/components/full-text-search-view/full-text-search-view.module';

import { OrganizeToolbarComponent } from './organize-toolbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [SharedModule, BreadcrumbsModule, FullTextSearchModule, MatTooltipModule],
  exports: [OrganizeToolbarComponent],
  declarations: [OrganizeToolbarComponent],
  providers: [],
})
export class OrganizeToolbarModule { }
