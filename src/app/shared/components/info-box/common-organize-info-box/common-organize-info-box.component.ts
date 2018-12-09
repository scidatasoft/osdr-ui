/* tslint:disable:no-access-missing-member */
// TODO remove it after lint bug will fix
import { Component, Injector, ViewChild, EventEmitter, Output } from '@angular/core';
import { BasicOrganizeInfoBoxComponent } from '../basic-organize-info-box/basic-organize-info-box.component';

@Component({
  selector: 'dr-common-organize-info-box',
  templateUrl: './common-organize-info-box.component.html',
  styleUrls: ['./common-organize-info-box.component.scss']
})
export class CommonOrganizeInfoBoxComponent extends BasicOrganizeInfoBoxComponent {

  @ViewChild('collapseContainer') collapseContainer;

  maxPropNameElWidth = 300;

  @Output() onEdit = new EventEmitter<any>();
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

  disableTooltip(el) {
    return el.offsetWidth < this.maxPropNameElWidth;
  }

  onEditClick(e){
    e.preventDefault();
    e.stopPropagation();
    this.onEdit.emit(null);
  }
}
