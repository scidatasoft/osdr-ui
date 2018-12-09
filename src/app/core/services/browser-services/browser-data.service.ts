
import { throwError as observableThrowError, Observable, Subscription, asapScheduler, EMPTY } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { NodesApiService } from '../api/nodes-api.service';
import { FoldersApiService } from '../api/folders-api.service';
import { convertToParamMap, Params, Router } from '@angular/router';
import { BrowserDataBaseService } from './browser-data-base.service';
import { BrowserData, BrowserDataItem, NodeType } from 'app/shared/components/organize-browser/browser-types';
import { AuthService } from '../auth/auth.service';
import { NodeEvent, SignalREvent, SignalREventPermissionChanged } from 'app/shared/components/notifications/events.model';
import { SignalrService } from '../signalr/signalr.service';
import { PaginatorManagerService } from './paginator-manager.service';
import { UsersApiService } from '../api/users-api.service';
import { SearchResultsApiService } from '../api/search-results-api.service';
import { observeOn, catchError, map } from 'rxjs/operators';

export interface IBrowserEvent {
  event: MouseEvent;
  item: BrowserDataItem;
}

@Injectable()
export class BrowserDataService extends BrowserDataBaseService {

  private browserUpdateSubscription: Subscription = null;

  constructor(protected nodesApi: NodesApiService,
    protected foldersApi: FoldersApiService,
    protected auth: AuthService,
    protected router: Router,
    protected signalr: SignalrService,
    protected ngZone: NgZone,
    public paginator: PaginatorManagerService,
    protected usersApi: UsersApiService,
    protected searchResultsApi: SearchResultsApiService) {
    super();
  }

  subscribeToEvents() {
    this.browserUpdateSubscription = this.signalr.organizeUpdate.pipe(
      observeOn(asapScheduler),
      catchError(
        (error) => {
          console.log(error);
          throw EMPTY;
        }
      )).subscribe(
        (signalRData: SignalREvent) => {
          this.updateItem(signalRData);
        },
        (error) => {
          console.log('Error ', error);
        },
        () => {
          console.log('Completed');
        }
      );
  }

  unSubscribe() {
    if (this.browserUpdateSubscription) {
      this.browserUpdateSubscription.unsubscribe();
    }
  }

  setActiveNode(id: string = null): Observable<BrowserDataItem> {
    const ownId = (id === null ? this.auth.user.profile.sub : id);
    return this.nodesApi.getNode(ownId).pipe(map(
      (item: any) => {
        this.currentItem = new BrowserDataItem(item.body);
        if (this.currentItem.ownedBy) {
          this.currentItem.userInfo = this.usersApi.getUserInfo(this.currentItem.ownedBy);
        }
        if ((this.auth.user
          && this.auth.user.profile
          && (this.auth.user.profile.sub === this.currentItem.ownedBy ||
            this.auth.user.profile.sub === ownId))) {
          this.nodesApi.setCurrentNodeWithoutBreadCrumbs(ownId).subscribe();
        }
        return this.currentItem;
      }
    ));
  }

  getBreadCrumbs(): { text: string; link: string }[] {
    return this.breadcrumbs;
  }

  initBreadCrumbs(id: string = null): Observable<any> {
    return this.nodesApi.getBreadCrumbs(id).pipe(map(
      (data) => {
        this.generateBreadCrumbs(data);
      }
    ));
  }

  protected generateBreadCrumbs(breadcrumbsList: { Id: string, Name: string }[]) {
    const breadcrumbs = [{ text: 'DRAFTS', width: null, link: '/organize/drafts' }];

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
        link: `/organize/${this.currentItem.id}`
      });
    }
    this.breadcrumbs = breadcrumbs;
  }

  setViewParams(viewParams: Params) {
    this.viewParams = viewParams;
  }

  refreshData(inputEvent?: SignalREvent) {
    if (inputEvent) {
      this.updateItem(inputEvent);
    } else {
      this.data = new BrowserData();
      const p: Params = [];
      p['pageNumber'] = this.paginator.paging.current;
      p['pageSize'] = this.paginator.paging.itemsPerPage;

      const mergedParams = this.mergeParams(p);
      this.browserLoading = true;

      if (mergedParams['search']) {
        this.getSearchData(mergedParams).subscribe(data => {
          this.data = data;
          this.paginator.setPaginatorData(data.count);
          this.browserLoading = false;
        }, (error) => {
          this.browserLoading = false;
        });
      } else if (mergedParams['$filter']) {
        this.getFilteredItems(mergedParams).subscribe(data => {
          this.data = data;
          this.paginator.setPaginatorData(data.count);
          this.browserLoading = false;
        }, (error) => {
          this.browserLoading = false;
        });
      } else {
        this.getItems(mergedParams, this.currentItem.type).subscribe(data => {
          this.data = data;
          this.paginator.setPaginatorData(data.count);
          this.browserLoading = false;
        }, (error) => {
          this.browserLoading = false;
        });
      }
    }
  }

  mergeParams(params: Params): Params {
    const viewParams = convertToParamMap(this.viewParams);
    const p: Params = [];

    for (const in_param in params) {
      if (params.hasOwnProperty(in_param)) {
        p[in_param] = params[in_param];
      }
    }

    const pMap = convertToParamMap(p);
    for (const param of viewParams.keys) {
      if (!pMap.has(param)) {
        p[param] = viewParams.get(param);
      } else {
        p[param] = viewParams.get(param);
      }
    }
    return p;
  }

  private getLocalItemByID(elementId: string): { inList: boolean, updatedItem: BrowserDataItem } {
    let inList = false;
    let updatedItem = null;
    for (const i of this.data.items) {
      if (i.id === elementId) {
        inList = true;
        updatedItem = i;
        break;
      }
    }
    return { inList, updatedItem };
  }

  updateItem(inputEvent: SignalREvent) {
    if (inputEvent.isDeleteRemoveAction()) {
      const { inList, updatedItem } = this.getLocalItemByID(inputEvent.Id);

      const index = this.data.items.indexOf(updatedItem);
      if (index >= 0) {
        this.data.items.splice(index, 1);
        if (this.isItemSelected(updatedItem)) {
          this.removeItemFromSelections(updatedItem);
        }
      }
      if (this.paginator.paging.itemsCount > 0) {
        this.paginator.paging.itemsCount--;
      }
    } else if (inputEvent.isRenameAddAction()) {
      this.ngZone.runOutsideAngular(
        () => {
          this.getItem(inputEvent.Id).subscribe(
            (itemDataInfo: BrowserDataItem) => {
              itemDataInfo.userInfo = this.usersApi.getUserInfo(itemDataInfo.ownedBy);
              // console.log(itemDataInfo);

              if (inputEvent.getNodeEvent() === NodeEvent.FileCreated
                || inputEvent.getNodeEvent() === NodeEvent.FolderCreated) {
                this.ngZone.run(
                  () => {
                    if (this.data.count === 0) {
                      this.data.count++;
                    }
                    this.paginator.paging.itemsCount++;
                  }
                );
              }
              const { inList, updatedItem } = this.getLocalItemByID(inputEvent.Id);

              if (inList && (<any>itemDataInfo).parentId === this.parentItem.id) {
                this.ngZone.run(
                  () => {
                    this.data.items[this.data.items.indexOf(updatedItem)] = itemDataInfo;
                  }
                );
                if (this.isItemSelected(updatedItem)) {
                  this.ngZone.run(
                    () => {
                      this.removeItemFromSelections(updatedItem);
                      this.addItemToSelections(itemDataInfo);
                    }
                  );
                }
              } else if (this.parentItem && !inList && updatedItem == null && (<any>itemDataInfo).parentId === this.parentItem.id) {
                this.ngZone.run(
                  () => {
                    this.data.items.push(itemDataInfo);
                  }
                );
              }
            }
            , (error) => {
              console.log(error);
            }
          );
        }
      );
    } else if (inputEvent.EventName === 'PermissionsChanged') {
      const permissionEvent = inputEvent.EventData as SignalREventPermissionChanged;
      const { updatedItem } = this.getLocalItemByID(inputEvent.Id);
      if (updatedItem.accessPermissions) {
        updatedItem.accessPermissions.isPublic = permissionEvent.permissionPublic;
      } else {
        updatedItem.accessPermissions = {
          isPublic: permissionEvent.permissionPublic,
          id: '',
          users: [],
          groups: []
        };
      }
    } else {
      const { updatedItem } = this.getLocalItemByID(inputEvent.Id);
      if (updatedItem) {
        updatedItem.version = inputEvent.EventData.version;
        updatedItem.status = inputEvent.getStatusAsString();
      }
    }
  }

  getItems(params: Params, nodeType?: string): Observable<any> {
    return this.foldersApi.getFolderContentWithParams(this.currentItem.id, params).pipe(map(
      (folderContent: any) => this.parseResponse(folderContent),
    ));
  }

  getFilteredItems(params: Params): Observable<any> {
    if (params['$filter'] === 'public') {
      return this.nodesApi.getPublicFiles(params).pipe(map(
        (folderContent: any) => this.parseResponse(folderContent),
      ));
    } else {
      return this.nodesApi.getNodeWithFilter(params).pipe(map(
        (folderContent: any) => {
          const itemsArray = folderContent.data.map(
            (rawItem: BrowserDataItem) => {
              const newItem = new BrowserDataItem(rawItem);
              // TODO kostyl
              if (!newItem.name) {
                newItem.name = '-1';
              }
              return newItem;
            }
          );
          folderContent.data = itemsArray;
          return this.parseResponse(folderContent);
        },
      ));
    }
  }

  getSearchData(params: Params): Observable<any> {
    const pageNumber = params['pageNumber'] ? params['pageNumber'] : 1;
    if (!this.searchData && params['search']) {
      this.searchData = params['search'];
    }
    return this.searchResultsApi.getFullTextSearchResult(this.searchData, params['pageSize'], pageNumber).pipe(map(
      (folderContent: any) => this.parseResponse(folderContent),
    ));
    // return this.searchResultsApi.getSearchResult(this.searchData, params['pageSize']).map(
    //   (folderContent: any) => this.parseResponse(folderContent),
    // );
  }

  parseResponse(folderContent: any): BrowserData {
    this.parentItem = this.currentItem;
    if (!this.currentItem.id) {
      const dataItem = new BrowserDataItem();
      dataItem.id = this.auth.user.profile.sub;
      this.parentItem = dataItem;
    }

    const bData = new BrowserData();

    for (const it of folderContent.data) {
      const newItem: BrowserDataItem = new BrowserDataItem(it);
      newItem.userInfo = this.usersApi.getUserInfo(newItem.ownedBy);
      newItem.link = this.getItemLink(newItem);

      // Set record name
      if (newItem.getNodeType() === NodeType.Record) {
        newItem.recordName = this.nodesApi.getRecordName(newItem.parentId);
      }

      bData.items.push(newItem);
    }

    bData.count = folderContent.page.totalCount;

    return bData;
  }

  getItem(id: string) {
    return this.nodesApi.getNode(id).pipe(map(
      (data) => {
        return new BrowserDataItem(data.body as BrowserDataItem);
      }
    ), catchError(
      (error) => {
        return observableThrowError(null);
      }
    ));
  }

  getItemLink(item) {
    if (item.isFolder()) {
      return this.router.url + '/' + item.name;
    } else if (item.type === NodeType[NodeType.Model]) {
      return '/model/' + item.id;
    } else {
      return '/file/' + item.id;

    }
  }

  addItemToSelections(item: BrowserDataItem) {
    if (item) {
      if (this.selectedItems.indexOf(item) < 0) {
        this.selectedItems.push(item);
      }
      this.selectionChangeEvents.next(this.selectedItems);
    }
  }

  removeItemFromSelections(item: BrowserDataItem) {
    const index = this.selectedItems.indexOf(item);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    }
    this.selectionChangeEvents.next(this.selectedItems);
  }

  clearSelection() {
    this.selectedItems = [];
    this.selectionChangeEvents.next(this.selectedItems);

  }

  getSelectedItems(): BrowserDataItem[] {
    return this.selectedItems;
  }

  isItemSelected(item: BrowserDataItem): boolean {
    return this.selectedItems.indexOf(item) >= 0;
  }
}
