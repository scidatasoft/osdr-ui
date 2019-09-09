import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NodesApiService } from '../api/nodes-api.service';

@Injectable()
export class ShareElementGuard implements CanActivate {

  constructor(private router: Router, private nodesApi: NodesApiService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const id = next.paramMap.get('id');

    return this.nodesApi.getNodeHEAD(id).pipe(map(
      (response) => {
        // TODO redirect to 404 if false
        return response.status < 300;
      },
    ), catchError(
      (error) => {
        return Observable.create(
          (observer) => {
            // TODO redirect to 404
            this.router.navigate(['/404']);
            observer.next(false);
          },
        ) as Observable<boolean>;
      },
    ));
  }
}
