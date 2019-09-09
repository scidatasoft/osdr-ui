import {Component, Injector, Input} from '@angular/core';

@Component({
  selector: 'dr-basic-organize-info-box',
  templateUrl: './basic-organize-info-box.component.html',
  styleUrls: ['./basic-organize-info-box.component.scss'],
})
export class BasicOrganizeInfoBoxComponent {

  @Input() title: string;
  @Input() icon: string;
  @Input() data: any;

  id: number;

  constructor(public injector: Injector) {
    this.title = this.injector.get('title');
    this.icon = this.injector.get('icon');
    this.data = this.injector.get('data');
  }
}
