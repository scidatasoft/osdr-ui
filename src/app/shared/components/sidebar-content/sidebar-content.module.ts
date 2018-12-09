import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { SidebarContentComponent } from './sidebar-content.component';

@NgModule({
  imports: [...CommonModulesList, SharedModule],
  exports: [SidebarContentComponent],
  declarations: [SidebarContentComponent],
  providers: [],
})
export class SidebarContentModule { }
