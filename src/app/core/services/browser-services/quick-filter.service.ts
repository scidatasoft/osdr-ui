import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface IQuickFilter {
  filterValue: string;
  isFilterSet: boolean;
}

@Injectable()
export class QuickFilterService implements IQuickFilter {
  filterEvents: Subject<any> = new Subject();
  initFilterEvents: Subject<any> = new Subject();
  private _filterValue: string;
  private _isFilterSet: boolean;
  private map: Map<string, string> = null;

  counters = [
    { name: 'All Files', key: 'all' },
    { name: 'Shared By Me', key: 'sharedByMe' },
    { name: 'Shared With Me', key: 'sharedWithMe' },
    { name: 'Documents', key: 'documents' },
    { name: 'Images', key: 'images' },
    { name: 'Microscopy', key: 'microscopy' },
    { name: 'Models', key: 'models' },
    { name: 'Structures', key: 'structures' },
    { name: 'Crystals', key: 'crystals' },
    { name: 'Reactions', key: 'reactions' },
    { name: 'Spectra', key: 'spectra' },
    { name: 'Datasets', key: 'datasets' },
    { name: 'Webpages', key: 'webpages' },
  ];

  constructor() {
    this.map = new Map();
    this.map.set('all', `nodes?pageNumber=1&pageSize=20`);
    this.map.set('documents', `type eq 'File' and SubType in ('Office', 'Pdf')`);
    this.map.set('structures', `type eq 'Record' and SubType eq 'Structure'`);
    this.map.set('images', `type eq 'File' and SubType eq 'Image'`);
    this.map.set('microscopy', `type eq 'File' and SubType eq 'Microscopy'`);
    this.map.set('models', `type eq 'Model'`);
    this.map.set('crystals', `type eq 'Record' and SubType eq 'Crystal'`);
    this.map.set('reactions', `type eq 'Record' and SubType eq 'Reaction'`);
    this.map.set('spectra', `type eq 'Record' and SubType eq 'Spectrum'`);
    this.map.set('datasets', `type eq 'File' and SubType eq 'Tabular'`);
    this.map.set('webpages', `type eq 'File' and SubType eq 'WebPage'`);
    // TODO add real filter when back end will be ready
    this.map.set('sharedByMe', `accessPermissions.isPublic eq true`);
    this.map.set('sharedWithMe', `public`);
  }

  get filterValue(): string {
    return this._filterValue;
  }

  get isFilterSet(): boolean {
    return this._isFilterSet;
  }

  changeFilterState(filter: IQuickFilter) {
    this._filterValue = filter.filterValue;
    this._isFilterSet = filter.isFilterSet;
    this.filterEvents.next(this as IQuickFilter);
  }

  initView(filter: IQuickFilter) {
    this._filterValue = filter.filterValue;
    this._isFilterSet = filter.isFilterSet;
    this.initFilterEvents.next(this as IQuickFilter);
  }

  getFilterState(): IQuickFilter {
    return this as IQuickFilter;
  }

  clearFilter() {
    this._filterValue = '';
    this._isFilterSet = false;
    this.filterEvents.next(this as IQuickFilter);
  }

  getFilterByKey(filterValue: string) {
    return this.map.get(filterValue);
  }

  getFilterKeyByValue(value: string): string {
    if (value) {
      for (const key of Array.from(this.map.keys())) {
        if (this.map.get(key) === value) {
          return key;
        }
      }
    } else {
      return null;
    }
  }

  getFilterTitle(value: string): string {
    if (value) {
      for (const key of Array.from(this.map.keys())) {
        if (this.map.get(key) === value) {
          for (const item of this.counters) {
            if (item.key === key) {
              return item.name;
            }
          }
        }
      }
    } else {
      return null;
    }
  }
}
