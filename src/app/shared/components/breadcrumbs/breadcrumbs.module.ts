import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { BreadcrumbsComponent } from './breadcrumbs.component';

const MatModules = [
  MatTooltipModule,
];

@NgModule({
  imports: [SharedModule, ...MatModules],
  exports: [BreadcrumbsComponent],
  declarations: [BreadcrumbsComponent],
  providers: [],
})
export class BreadcrumbsModule { }
