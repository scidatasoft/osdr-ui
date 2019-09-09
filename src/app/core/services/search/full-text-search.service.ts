import { Injectable } from '@angular/core';
import { SearchResultsApiService } from 'app/core/services/api/search-results-api.service';
import {BrowserDataItem} from 'app/shared/components/organize-browser/browser-types';
import {Subject} from 'rxjs';

@Injectable()
export class FullTextSearchService {

  searchString = '';
  searchEvent: Subject<{link: string, object: BrowserDataItem}[]> = new Subject();

  constructor(private searchResultsApi: SearchResultsApiService) {
  }

  sendSearchResult(message: {link: string, object: BrowserDataItem}[]) {
    this.searchEvent.next(message);
  }

  doSearch(queryString: string) {
    this.searchString = queryString;
    if (queryString && queryString.length > 0) {
      this.searchResultsApi.getSearchResult(queryString).subscribe(
        (searchResult: {link: string, object: BrowserDataItem}[]) => {
          this.sendSearchResult(searchResult);
        },
      );
    } else {
      this.sendSearchResult(null);
    }
  }
}
