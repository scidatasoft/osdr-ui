import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserDataItem } from 'app/shared/components/organize-browser/browser-types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class NodesApiService {
  constructor(public http: HttpClient, public auth: AuthService) {}

  joinParams(params): string {
    let query = '';
    if (params) {
      query = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    }
    if (query.length > 0) {
      query = `?${query}`;
    }
    return query;
  }

  setCurrentNode(id?: string): Observable<any> {
    let request: { Id?: string };
    request = { Id: id };
    return this.http.post(environment.apiUrl + '/nodes/current', request, { observe: 'response' }).pipe(
      map(x => {
        return {
          breadcrumbs: JSON.parse(decodeURIComponent(x.headers.get('x-breadcrumbs'))) as { Id: string; Name: string }[],
          item: new BrowserDataItem(x.body as BrowserDataItem),
        };
      }),
    );
  }

  getNode(id, params?, ignoreCache = true): Observable<any> {
    const timeStamp = +new Date();

    if (ignoreCache) {
      if (params) {
        params['tsp'] = timeStamp;
      } else {
        params = { tsp: timeStamp };
      }
    }

    const paramsUrl = params ? this.joinParams(params) : '';

    return this.http.get(`${environment.apiUrl}/nodes/${id || ''}${paramsUrl}`, { observe: 'response' });
  }

  getNodePageLocationNumber(id: string, itemsPerPage?: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/nodes/${id}/page?pageSize=${itemsPerPage || '20'}`, { observe: 'response' });
  }

  getRawNode(id, params?, ignoreCache = true): Observable<BrowserDataItem> {
    const timeStamp = +new Date();

    if (ignoreCache) {
      if (params) {
        params['tsp'] = timeStamp;
      } else {
        params = { tsp: timeStamp };
      }
    }

    const paramsUrl = params ? this.joinParams(params) : '';

    return this.http.get<BrowserDataItem>(`${environment.apiUrl}/nodes/${id || ''}${paramsUrl}`);
  }

  getNodeHEAD(id, params?, ignoreCache = true): Observable<any> {
    const timeStamp = +new Date();

    if (ignoreCache) {
      if (params) {
        params['tsp'] = timeStamp;
      } else {
        params = { tsp: timeStamp };
      }
    }

    const paramsUrl = params ? this.joinParams(params) : '';

    return this.http.head(`${environment.apiUrl}/nodes/${id || ''}${paramsUrl}`, { observe: 'response' });
  }

  getNodes(id, params?): Observable<any> {
    const paramsUrl = params ? this.joinParams(params) : '';
    return this.http.get(`${environment.apiUrl}/nodes/${id}/nodes${paramsUrl}`, { observe: 'response' });
  }

  getBreadCrumbs(id: string = null): Observable<{ Id: string; Name: string }[]> {
    let folder_id = '';
    if (id === null && this.auth.user && this.auth.user.profile) {
      folder_id = this.auth.user.profile.sub;
    } else if (id !== null) {
      folder_id = id;
    }

    return this.http.head(`${environment.apiUrl}/nodes/${folder_id}`, { observe: 'response', responseType: 'text' }).pipe(
      map(x => {
        return JSON.parse(decodeURIComponent(x.headers.get('x-breadcrumbs'))) as { Id: string; Name: string }[];
      }),
    );
  }

  setCurrentNodeWithoutBreadCrumbs(id?: string): Observable<BrowserDataItem> {
    let request: { Id?: string };
    request = { Id: id };
    return this.http.post<BrowserDataItem>(`${environment.apiUrl}/nodes/current`, request).pipe(
      map(x => {
        return new BrowserDataItem(x as BrowserDataItem);
      }),
    );
  }

  getNodeWithFilter(params): Observable<any> {
    const paramsUrl = params ? this.joinParams(params) : '';
    return this.http.get(`${environment.apiUrl}/nodes${paramsUrl}`, { observe: 'response' }).pipe(
      map(x => ({
        data: x.body as BrowserDataItem[],
        page: JSON.parse(x.headers.get('x-pagination')),
      })),
    );
  }

  getSharedFiles(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/nodes/?$filter=accessPermissions.isPublic eq true`, { observe: 'response' }).pipe(
      map(x => ({
        data: x.body as BrowserDataItem[],
        page: JSON.parse(x.headers.get('x-pagination')),
      })),
    );
  }

  getPublicFiles(params): Observable<any> {
    delete params.$filter;
    const paramsUrl = params ? this.joinParams(params) : 'PageSize=1&PageNumber=20';
    return this.http.get(`${environment.apiUrl}/nodes/public${paramsUrl}`, { observe: 'response' }).pipe(
      map(x => ({
        data: x.body as BrowserDataItem[],
        page: JSON.parse(x.headers.get('x-pagination')),
      })),
    );
  }

  getPublicNodesHead(params): Observable<any> {
    return this.http.head(`${environment.apiUrl}/nodes/${params}`, { observe: 'response', responseType: 'text' }).pipe(
      map(x => {
        return JSON.parse(decodeURIComponent(x.headers.get('x-pagination')));
      }),
    );
  }

  getRecordName(parentId: string): Observable<string> {
    return this.http.get<{ id: string; name: string }>(`${environment.apiUrl}/nodes/${parentId}?$projection=name`).pipe(
      map(data => {
        return data.name;
      }),
    );
  }
}
