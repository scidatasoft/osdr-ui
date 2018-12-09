import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizeBrowserComponent } from './organize-browser.component';

@NgModule({
  imports: [...CommonModulesList, SharedModule],
  exports: [OrganizeBrowserComponent],
  declarations: [OrganizeBrowserComponent],
  providers: [],
})
export class OrganizeBrowserModule { }
