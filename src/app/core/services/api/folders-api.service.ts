import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BrowserDataItem } from 'app/shared/components/organize-browser/browser-types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

import { NodesApiService } from './nodes-api.service';

@Injectable()
export class FoldersApiService {
  constructor(public http: HttpClient, public auth: AuthService, private nodesApi: NodesApiService) {}

  getFolderContent(path, pageNumber: number, pageSize: number): Observable<any> {
    const queryParams = { pageNumber, pageSize, type: 'file,folder' };

    return this.nodesApi.getNodes(path ? path : 'me', queryParams).pipe(
      map(x => ({
        data: x.body as BrowserDataItem[],
        page: JSON.parse(x.headers.get('x-pagination')),
      })),
    );
  }

  getFolderContentById(folderId: string): Observable<any> {
    const nodeParams = { pageSize: '100', type: 'file,folder' };

    if (folderId.length !== 0) {
      return this.nodesApi.getNode(folderId, nodeParams).pipe(
        flatMap(outputData => {
          const dataO = outputData.body;
          return this.nodesApi.getNodes(dataO.id, nodeParams).pipe(
            map(oupPutData2 => {
              return {
                id: outputData.body.id,
                parentId: outputData.body.parentId,
                contentItems: oupPutData2.body as BrowserDataItem[],
              };
            }),
          );
        }),
      );
    } else {
      return this.nodesApi.getNodes('me', nodeParams).pipe(
        map(oupPutData2 => {
          return {
            id: null,
            parentId: null,
            contentItems: oupPutData2.body as BrowserDataItem[],
          };
        }),
      );
    }
  }

  getFolderInfoByPath(path) {
    return this.nodesApi.getNode(path).pipe(map(x => new BrowserDataItem(x.body as BrowserDataItem)));
  }

  deleteFolder(itemsCollection: BrowserDataItem[]) {
    let data: { op: string; path: string; value: { id: string; version: number; type: string }[] };

    data = {
      op: 'add',
      path: '/deleted',
      value: [],
    };

    for (const i of itemsCollection) {
      data.value.push({ id: i.id, version: i.version, type: i.type });
    }

    const url = `${environment.apiUrl}/nodecollections`;
    this.http.patch(url, [data]).subscribe(dataOutput => {}, error => {});
  }

  moveFolder(itemsCollection: BrowserDataItem[], toFolder: BrowserDataItem) {
    if (!toFolder.id) {
      toFolder.id = this.auth.user.profile.sub;
    }

    const whereToMove = {
      op: 'replace',
      path: '/parentid',
      value: toFolder.id,
    };

    let data: { op: string; path: string; value: { id: string; version: number; type: string }[] };
    data = {
      op: 'add',
      path: '/moved',
      value: [],
    };

    for (const i of itemsCollection) {
      data.value.push({ id: i.id, version: i.version, type: i.type });
    }

    const url = `${environment.apiUrl}/nodecollections`;
    this.http.patch(url, [data, whereToMove]).subscribe(dataOutput => {}, error => {});
  }

  createFolder(folderName: string, parent: any) {
    let data: { Name: string; parentId?: string };

    if (parent) {
      data = { Name: folderName, parentId: parent.id };
    } else {
      data = { Name: folderName };
    }

    this.http.post(`${environment.apiUrl}/entities/folders`, data).subscribe(dataOutput => {}, error => {});
  }

  getFolderContentWithParams(id: string, params: Params) {
    return this.nodesApi.getNodes(id ? id : 'me', params).pipe(
      map(x => ({
        data: x.body as BrowserDataItem[],
        page: JSON.parse(x.headers.get('x-pagination')),
      })),
    );
  }
}
