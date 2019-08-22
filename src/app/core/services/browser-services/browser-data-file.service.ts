import {Injectable, NgZone} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable} from 'rxjs';

// Own resources
import {BrowserDataItem, FileType} from 'app/shared/components/organize-browser/browser-types';
import {BrowserDataService} from './browser-data.service';
import {NodesApiService} from '../api/nodes-api.service';
import {FoldersApiService} from '../api/folders-api.service';
import {AuthService} from '../auth/auth.service';
import {SignalrService} from '../signalr/signalr.service';
import {PaginatorManagerService} from './paginator-manager.service';
import {FilesApiService} from '../api/files-api.service';
import {UsersApiService} from '../api/users-api.service';
import {SearchResultsApiService} from '../api/search-results-api.service';

@Injectable()
export class BrowserDataFileService extends BrowserDataService {

  constructor(protected nodesApi: NodesApiService,
              protected foldersApi: FoldersApiService,
              protected auth: AuthService,
              protected router: Router,
              protected signalr: SignalrService,
              protected ngZone: NgZone,
              public paginator: PaginatorManagerService,
              private filesApi: FilesApiService,
              private activatedRoute: ActivatedRoute,
              protected usersApi: UsersApiService,
              protected searchResultsApi: SearchResultsApiService) {
    super(nodesApi, foldersApi, auth, router, signalr, ngZone, paginator, usersApi, searchResultsApi);
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
            x.items.map(z => {
              z.link = `/${z.type}/` + z.id;
            });
            x.items = x.items.map(z => {
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
            x.items.map(z => {
              z.name = z.id;
              z.link = '/record/' + z.id;
            });
            x.items = x.items.map((z: BrowserDataItem) => {
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
    if (this.myActivateRouter && this.myActivateRouter.snapshot.data.share &&
      this.myActivateRouter.snapshot.data.share === true) {
      const breadcrumbs = [];

      breadcrumbs.push({
        text: this.currentItem.name,
        width: null,
        link: `/organize/${this.currentItem.id}`
      });
      this.breadcrumbs = breadcrumbs;
    } else {
      super.generateBreadCrumbs(breadcrumbsList);
    }
  }
}
