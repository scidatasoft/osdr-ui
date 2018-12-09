import {Injectable} from '@angular/core';
import {CommonOrganizeInfoBoxComponent} from './common-organize-info-box/common-organize-info-box.component';
import {CvspOrganizeInfoBoxComponent} from './cvsp-organize-info-box/cvsp-organize-info-box.component';


@Injectable()
export class InfoBoxFactoryService {
  setBasicInfoBoxComponent(component: any, title: string, icon: string, data: any): any {
    return {component: component, inputs: {title: title, icon: icon, data: data}}
  }

  setCommonInfoBoxComponent(title: string, icon: string, data: any): any {
    return this.setBasicInfoBoxComponent(CommonOrganizeInfoBoxComponent, title, icon, data);
  }

  setCvspInfoBoxComponent(title: string, icon: string, data: any): any {
    return this.setBasicInfoBoxComponent(CvspOrganizeInfoBoxComponent, title, icon, data);
  }
}
