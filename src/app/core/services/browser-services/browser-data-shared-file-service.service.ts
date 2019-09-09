import {Injectable, NgZone} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import {BrowserDataItem} from '../../../shared/components/organize-browser/browser-types';
import { FilesApiService } from '../api/files-api.service';
import { FoldersApiService } from '../api/folders-api.service';
import { NodesApiService } from '../api/nodes-api.service';
import { SearchResultsApiService } from '../api/search-results-api.service';
import { UsersApiService } from '../api/users-api.service';
import { AuthService } from '../auth/auth.service';
import { SignalrService } from '../signalr/signalr.service';

import { BrowserDataService } from './browser-data.service';
import { PaginatorManagerService } from './paginator-manager.service';

@Injectable()
export class BrowserDataSharedFileServiceService extends BrowserDataService {

  constructor(protected nodesApi: NodesApiService,
              protected foldersApi: FoldersApiService,
              protected auth: AuthService,
              protected router: Router,
              protected signalr: SignalrService,
              protected ngZone: NgZone,
              public paginator: PaginatorManagerService,
              private filesApi: FilesApiService,
              protected usersApi: UsersApiService,
              protected searchResultsApi: SearchResultsApiService) {
    super(nodesApi, foldersApi, auth, router, signalr, ngZone, paginator, usersApi, searchResultsApi);
  }

  setActiveNode(id: string = null): Observable<BrowserDataItem> {
    return this.nodesApi.getNode({ id: { id } }).pipe(map(
      (item: any) => {
        this.currentItem = new BrowserDataItem(item.body);
        if (this.currentItem.ownedBy) {
          this.currentItem.userInfo = this.usersApi.getUserInfo(this.currentItem.ownedBy);
        }
        return this.currentItem;
      },
    ));
  }

  getItems(inputParams: Params, parentType?: string): Observable<any> {
    return Observable.create(observer => {
      this.myActivateRouter.params.subscribe(params => {
        // inputParams['type'] = 'record';
        const fileId = params.id;
        if (parentType === 'Model') {
          this.filesApi.getRecordsWithParams(fileId, inputParams)
          .subscribe(x => {
            x.count = x.page.totalCount;
            x.items.map((z: any) => {
              z.link = `/${z.type}/` + z.id;
            });
            x.items = x.items.map((z: any) => {
              const newItem = new BrowserDataItem(z);
              newItem.userInfo = this.usersApi.getUserInfo(newItem.ownedBy);
              return newItem;
            });
            observer.next(x);
          });
        } else {
          this.filesApi.getRecordsWithParams(fileId, inputParams)
          .subscribe(x => {
            x.count = x.page.totalCount;
            x.items.map((z: any) => {
              z.name = z.id;
              z.link = '/record/' + z.id;
            });
            x.items = x.items.map((z: any) => {
              const newItem = new BrowserDataItem(z);
              newItem.userInfo = this.usersApi.getUserInfo(newItem.ownedBy);
              return newItem;
            });
            observer.next(x);
          });
        }
      });
    });
  }

  protected generateBreadCrumbs(breadcrumbsList: { Id: string, Name: string }[]) {
    const breadcrumbs = [];
    if (breadcrumbsList.length > 0) {
      for (let i = breadcrumbsList.length - 1; i >= 0; i--) {
        if (breadcrumbsList[i].Name) {
          if (breadcrumbsList[i]['Type'] === 'Model') {
            breadcrumbs.push(
              {
                text: breadcrumbsList[i].Name,
                width: null,
                link: `/model/${breadcrumbsList[i].Id}`,
              },
            );
          } else {
            breadcrumbs.push(
              {
                text: breadcrumbsList[i].Name,
                width: null,
                link: `/organize/${breadcrumbsList[i].Id}`,
              },
            );
          }
        }
      }
      breadcrumbs.push({
        text: this.currentItem.name,
        width: null,
        link: `/${this.currentItem.type}/${this.currentItem.id}`,
      });
    }
    const data: { share: boolean, shareParent: boolean } = this.myActivateRouter.snapshot.data;
    if (data.share && data.shareParent) {
      this.breadcrumbs = breadcrumbs.slice(breadcrumbs.length - 2, breadcrumbs.length);
    } else if (data.share && data.shareParent) {
      this.breadcrumbs = breadcrumbs.slice(breadcrumbs.length - 1, breadcrumbs.length);
    }
  }
}
