/* tslint:disable:no-access-missing-member */
// TODO remove it after lint bug will fix
import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';

import { BasicOrganizeInfoBoxComponent } from '../basic-organize-info-box/basic-organize-info-box.component';

@Component({
  selector: 'dr-common-organize-info-box',
  templateUrl: './common-organize-info-box.component.html',
  styleUrls: ['./common-organize-info-box.component.scss'],
})
export class CommonOrganizeInfoBoxComponent extends BasicOrganizeInfoBoxComponent {
  @ViewChild('collapseContainer', { static: true }) collapseContainer: { nativeElement: any };

  maxPropNameElWidth = 300;

  @Output() edit = new EventEmitter<any>();
  constructor(injector: Injector) {
    super(injector);
  }

  toggleCollapse() {
    try {
      // I know, it is bad idea to use $
      (window as any).$(this.collapseContainer.nativeElement).collapse('toggle');
    } catch (error) {}
  }

  disableTooltip(el: { offsetWidth: number }) {
    return el.offsetWidth < this.maxPropNameElWidth;
  }

  onEditClick(e: { preventDefault: () => void; stopPropagation: () => void }) {
    e.preventDefault();
    e.stopPropagation();
    this.edit.emit(null);
  }
}
