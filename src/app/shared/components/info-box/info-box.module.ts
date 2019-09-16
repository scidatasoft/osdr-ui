import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';

import { BasicOrganizeInfoBoxComponent } from './basic-organize-info-box/basic-organize-info-box.component';
import { CommonOrganizeInfoBoxComponent } from './common-organize-info-box/common-organize-info-box.component';
import { CvspOrganizeInfoBoxComponent } from './cvsp-organize-info-box/cvsp-organize-info-box.component';
import { InfoBoxFactoryService } from './info-box-factory.service';
import { OrganizeInfoBoxFactoryComponent } from './organize-info-box-factory/organize-info-box-factory.component';

const components = [
  BasicOrganizeInfoBoxComponent,
  CommonOrganizeInfoBoxComponent,
  CvspOrganizeInfoBoxComponent,
  OrganizeInfoBoxFactoryComponent,
];

@NgModule({
  imports: [SharedModule, MatTooltipModule, MatRippleModule],
  exports: [...components],
  declarations: [...components],
  providers: [InfoBoxFactoryService],
})
export class InfoBoxModule {}
