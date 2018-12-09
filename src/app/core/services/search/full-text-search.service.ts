import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {BrowserDataItem} from 'app/shared/components/organize-browser/browser-types';
import { SearchResultsApiService } from 'app/core/services/api/search-results-api.service';

@Injectable()
export class FullTextSearchService {

  searchString = '';
  searchEvent: Subject<{link: string, object: BrowserDataItem}[]> = new Subject();

  sendSearchResult(message: {link: string, object: BrowserDataItem}[]) {
    this.searchEvent.next(message);
  }

  constructor(private searchResultsApi: SearchResultsApiService) {
  }

  doSearch(queryString: string) {
    this.searchString = queryString;
    if (queryString && queryString.length > 0) {
      this.searchResultsApi.getSearchResult(queryString).subscribe(
        (searchResult: {link: string, object: BrowserDataItem}[]) => {
          this.sendSearchResult(searchResult);
        }
      );
    } else {
      this.sendSearchResult(null);
    }
  }
}
