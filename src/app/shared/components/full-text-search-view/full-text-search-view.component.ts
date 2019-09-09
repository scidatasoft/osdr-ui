import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from 'app/core/services/auth/auth.service';
import { ItemImagePreviewService } from 'app/core/services/item-preview-image-service/item-image-preview.service';
import { FullTextSearchService } from 'app/core/services/search/full-text-search.service';
import { BrowserDataItem, NodeType } from 'app/shared/components/organize-browser/browser-types';
import { Observable ,  Subscription } from 'rxjs';

import { NodesApiService } from '../../../core/services/api/nodes-api.service';

@Component({
  selector: 'dr-full-text-search-view',
  templateUrl: './full-text-search-view.component.html',
  styleUrls: ['./full-text-search-view.component.scss'],
  providers: [ItemImagePreviewService],
})
export class FullTextSearchViewComponent implements OnInit, OnDestroy {

  @Output() itemClickEvent = new EventEmitter<any>();
  nodeType = NodeType;

  public status: { isopen: boolean } = { isopen: false };
  private searchEventSubscription: Subscription;
  searchData: { link: string, object: BrowserDataItem, parentItem: any }[] = [];
  searchItemLocation: string;

  constructor(private searchService: FullTextSearchService,
              private imageService: ItemImagePreviewService,
              private nodeService: NodesApiService) { }

  ngOnInit() {
    this.searchEventSubscription = this.searchService.searchEvent.subscribe(
      (searchDataResponse: { link: string, object: BrowserDataItem, parentItem: any }[]) => {
        this.openDropDownSearchResult(searchDataResponse);
      },
    );
  }

  openDropDownSearchResult(searchedData: { link: string, object: BrowserDataItem, parentItem: any }[]) {
    if (searchedData && searchedData.length > 0 && searchedData[0] != null) {
      this.searchData = searchedData.filter(x => x.object.name);
      this.status.isopen = true;
    } else {
      this.status.isopen = false;
    }
  }

  public changeDropDownState(value: boolean): void {
    this.status.isopen = value;
  }

  onItemClick(event, item) {
    this.itemClickEvent.emit(item);
  }

  getPreviewImg(item) {
    return this.imageService.getPreviewImg(item);
  }

  ngOnDestroy() {
    if (this.searchEventSubscription) {
      this.searchEventSubscription.unsubscribe();
    }
  }
}
