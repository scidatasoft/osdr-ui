/* tslint:disable:no-access-missing-member */
// TODO remove it after lint bug will fix
import { Component, Injector, ViewChild } from '@angular/core';
import { BasicOrganizeInfoBoxComponent } from '../basic-organize-info-box/basic-organize-info-box.component';

@Component({
  selector: 'dr-cvsp-organize-info-box',
  templateUrl: './cvsp-organize-info-box.component.html',
  styleUrls: ['./cvsp-organize-info-box.component.scss']
})
export class CvspOrganizeInfoBoxComponent extends BasicOrganizeInfoBoxComponent {

  @ViewChild('collapseContainer', { static: true }) collapseContainer: { nativeElement: any; };

  constructor(injector: Injector) {
    super(injector);
  }

  toggleCollapse() {
    try {
      // I know, it is bad idea to use $
      (window as any).$(this.collapseContainer.nativeElement).collapse('toggle');
    } catch (error) {
    }
  }
}
