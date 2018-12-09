import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { NodesApiService } from '../api/nodes-api.service';
import { BrowserDataItem } from '../../../shared/components/organize-browser/browser-types';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class SharingResolver implements Resolve<boolean> {

  constructor(private auth: AuthService,
    private nodesApi: NodesApiService) {
  }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.nodesApi.getRawNode(route.params['id']).pipe(
      map(
        (item: BrowserDataItem) => {
          if (this.auth.user && this.auth.user.profile && this.auth.user.profile.sub === item.ownedBy) {
            return false;
          } else {
            return true;
          }
        }
      ), catchError(
        (error) => {
          return Observable.create(
            (observer) => {
              observer.next(false);
            }
          ) as Observable<boolean>;
        }
      ));
  }
}
