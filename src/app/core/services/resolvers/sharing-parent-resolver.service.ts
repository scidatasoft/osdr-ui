import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';

import { BrowserDataItem } from '../../../shared/components/organize-browser/browser-types';
import { NodesApiService } from '../api/nodes-api.service';

@Injectable()
export class SharingParentResolverService implements Resolve<boolean> {

  constructor(private nodesApi: NodesApiService) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.nodesApi.getRawNode(route.params['id']).pipe(
      flatMap(
        (item: BrowserDataItem) => {
          if (item.type !== 'Model' &&
            item.type !== 'User') {
            return this.nodesApi.getRawNode(item.parentId).pipe(
              map(
                (parentItem) => {
                  return true;
                },
                error => {
                  return false;
                },
              ), catchError(
                (error) => {
                  return of(false);
                },
              ));
            } else {
              return of(false);
            }
          },
      ), catchError(
        (error) => {
          return of(false);
        },
      ),
    );
  }
}
