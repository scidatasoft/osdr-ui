import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserDataItem, NodeType } from 'app/shared/components/organize-browser/browser-types';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

import { NodesApiService } from './nodes-api.service';

@Injectable()
export class SearchResultsApiService {

  parentItem = of('DRAFTS');
  constructor(public http: HttpClient,
              public auth: AuthService,
              private nodesApi: NodesApiService) {
  }

  getSearchResult(query, pageSize = 10): Observable<{ link: string, object: BrowserDataItem, parentItem: Observable<any> }[]> {
    return this.http.get(`${environment.apiUrl}/searchresults?query=${query}&PageNumber=1&PageSize=${pageSize}`
      , { observe: 'response' }).pipe(
        map(
        (data) => {

          const page = JSON.parse(data.headers.get('x-pagination'));
          const searchData: any = data.body;

          const preparedItems = this._prepareSearchResults(searchData);

          if (page.totalCount > 10) {
            const newElement = new BrowserDataItem();
            newElement.name = 'Open Results in Search View';
            const lastItem = { link: null, object: newElement };
            preparedItems.push(lastItem);
          }
          return preparedItems;
        },
      ));
  }

  _prepareSearchResults(searchData: any) {
    return searchData.map(
      (elementOfSearch) => {
        let link = '/organize/';

        if (elementOfSearch.type === NodeType[NodeType.Record]) {
          link = '/record/';
        } else if (elementOfSearch.type === NodeType[NodeType.File]) {
          link = '/file/';
        } else if (elementOfSearch.type === NodeType[NodeType.Model]) {
          link = '/model/';
        }

        const newElement = new BrowserDataItem(elementOfSearch);
        if (newElement.getNodeType() === NodeType.Record && newElement.subType === 'Structure') {
          newElement.recordName = this.nodesApi.getRecordName(newElement.parentId);
        }
        if (newElement.parentId === this.auth.user.profile.sub) {
          this.parentItem = of('DRAFTS');
        } else {
          this.parentItem = this.nodesApi.getRecordName(newElement.parentId).pipe(
            map(parentName => {
            if (parentName !== '' || undefined || null) {
              return parentName;
            }
          }));
        }
        return { link: link + newElement.id, object: newElement, parentItem: this.parentItem };
      },
    );
  }

  getFullTextSearchResult(query: string, pageSize = 20, pageNumber = 1) {
    return this.http.get(`${environment.apiUrl}/searchresults?query=${query}&pageNumber=${pageNumber}&pageSize=${pageSize}`
      , { observe: 'response' }).pipe(map(
        dataOutput =>
          (
            {
              data: (dataOutput.body as BrowserDataItem[])
                .map(item => {
                  const newItem = new BrowserDataItem(item);
                  if (newItem.name.length === 0) {
                    newItem.name = 'noname';
                  }
                  return newItem;
                }),
              page: JSON.parse(dataOutput.headers.get('x-pagination')),
            }
          ),
      ));
  }
}
