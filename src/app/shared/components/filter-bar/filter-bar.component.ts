import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FilterField } from 'app/shared/components/filter-bar/filter-bar.model';
import { NgForm } from '@angular/forms/src/forms';


@Component({
  selector: 'dr-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})

export class FilterBarComponent implements OnInit {

  @Output() filterChanged = new EventEmitter<FilterField[]>();
  @Input() filterFieldsList: FilterField[] = [];

  appliedFilterList: FilterField[] = [];

  // search property field
  searchField = '';

  constructor() { }

  ngOnInit() {
  }

  onAppliedFildMenuClick(field, form: NgForm) {
    form.setValue({ filterValue: field.value });
  }

  onAddFilter(filterdField) {
    filterdField.openDropDown = false;
    this.appliedFilterList.push(filterdField);
    this.searchField = '';
  }

  removeFilterField(filterdField) {
    const index = this.appliedFilterList.indexOf(filterdField, 0);
    if (index > -1) {
      filterdField.value = '';
      this.appliedFilterList.splice(index, 1);
    }
  }

  onSubmitFilter(field: FilterField, form: NgForm) {
    field.value = form.value.filterValue;
    this.filterChanged.emit(this.appliedFilterList);
  }
}
