import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap';

import { OrganizeBrowserComponent } from './organize-browser.component';

@NgModule({
  imports: [SharedModule, MatTooltipModule, BsDropdownModule],
  exports: [OrganizeBrowserComponent],
  declarations: [OrganizeBrowserComponent],
  providers: [],
})
export class OrganizeBrowserModule { }
