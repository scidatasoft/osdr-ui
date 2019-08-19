import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { BreadcrumbsComponent } from './breadcrumbs.component';
import { MatTooltipModule } from '@angular/material';


const MatModules = [
  MatTooltipModule
];


@NgModule({
  imports: [SharedModule, ...MatModules],
  exports: [BreadcrumbsComponent],
  declarations: [BreadcrumbsComponent],
  providers: [],
})
export class BreadcrumbsModule { }
