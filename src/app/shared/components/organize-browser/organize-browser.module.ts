import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizeBrowserComponent } from './organize-browser.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
  imports: [SharedModule, MatTooltipModule, BsDropdownModule],
  exports: [OrganizeBrowserComponent],
  declarations: [OrganizeBrowserComponent],
  providers: [],
})
export class OrganizeBrowserModule { }
