import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { InfoBoxFactoryService } from './info-box-factory.service';
import { BasicOrganizeInfoBoxComponent } from './basic-organize-info-box/basic-organize-info-box.component';
import { CommonOrganizeInfoBoxComponent } from './common-organize-info-box/common-organize-info-box.component';
import { CvspOrganizeInfoBoxComponent } from './cvsp-organize-info-box/cvsp-organize-info-box.component';
import { OrganizeInfoBoxFactoryComponent } from './organize-info-box-factory/organize-info-box-factory.component';


const components = [
  BasicOrganizeInfoBoxComponent,
  CommonOrganizeInfoBoxComponent,
  CvspOrganizeInfoBoxComponent,
  OrganizeInfoBoxFactoryComponent
];

@NgModule({
  imports: [SharedModule, ...CommonModulesList],
  exports: [...components],
  declarations: [...components],
  providers: [InfoBoxFactoryService],
})
export class InfoBoxModule { }
