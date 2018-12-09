import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material';

@Component({
  selector: 'dr-properties-info-box',
  templateUrl: './properties-info-box.component.html',
  styleUrls: ['./properties-info-box.component.scss']
})
export class PropertiesInfoBoxComponent implements OnInit {

  @ViewChild(MatExpansionPanel) panel;

  @Input() meta;
  @Input() data;
  @Input() isPublic = false;
  /*   @Input() icon;
    @Input() title;
    @Input() properties; */
  @Output() onEdit = new EventEmitter<any>();
  maxPropNameElWidth = 300; // px

  constructor() { }

  ngOnInit() {
  }

  onEditClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.onEdit.emit(null);
  }

  expand() {
    this.panel.expanded = true;
  }
}
