import { Component, Input, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dr-switch-response',
  templateUrl: 'switch-response.component.html',
})
export class SwitchResponseComponent implements OnInit{
  @Input() screenPartMetaData: any;
  @Input() screenCollectionData: any;
  @Input() index: number;

  ngOnInit() { }
}
