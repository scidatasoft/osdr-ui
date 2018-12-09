import {Injectable} from '@angular/core';
import {Params} from '@angular/router';
import {Subject, Observable} from 'rxjs';

// Own resources
import {BrowserData, BrowserDataItem, MultiItemSelection} from 'app/shared/components/organize-browser/browser-types';
import {IBrowserEvent} from './browser-data.service';

export enum BrowserViewState {
  browser,
  filterBrowser,
  searchResultBrowser
}

@Injectable()
export abstract class BrowserDataBaseService implements MultiItemSelection<BrowserDataItem> {
  browserServiceState: BrowserViewState = BrowserViewState.browser;
  browserStateChange: Subject<any> = new Subject();

  currentItem: BrowserDataItem = new BrowserDataItem();
  parentItem: BrowserDataItem = null;
  data: BrowserData = new BrowserData();
  browserEvents: Subject<IBrowserEvent> = new Subject();
  browserLoading = true;
  selectedItems: BrowserDataItem[] = [];
  selectionChangeEvents: Subject<BrowserDataItem[]> = new Subject();
  viewParams: Params;
  breadcrumbs: {text: string, width: number, link: string}[] = [];
  searchData = '';
  myActivateRouter: any;

  constructor() {
  }

  abstract setActiveNode(id: string);
  abstract setViewParams(viewParams: Params);
  abstract initBreadCrumbs(id: string): Observable<any>;
  abstract getBreadCrumbs(): any;
  abstract refreshData();

  sendBrowserEvent(event: IBrowserEvent) {
    this.browserEvents.next(event);
  }

  abstract addItemToSelections(item: BrowserDataItem);
  abstract removeItemFromSelections(item: BrowserDataItem);
  abstract clearSelection();
  abstract getSelectedItems();
  abstract isItemSelected(item: BrowserDataItem): boolean;

  abstract subscribeToEvents();
  abstract unSubscribe();

  setBrowserState(newValue: BrowserViewState) {
    this.browserServiceState = newValue;
    this.browserStateChange.next({oldValue: this.browserStateChange,
      newValue: newValue,
      searchString: this.searchData});
  }
}
