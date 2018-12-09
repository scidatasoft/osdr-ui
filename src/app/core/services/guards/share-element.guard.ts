import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NodesApiService } from '../api/nodes-api.service';
import { map, catchError } from 'rxjs/operators';

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
      }
    ), catchError(
      (error) => {
        return Observable.create(
          (observer) => {
            // TODO redirect to 404
            this.router.navigate(['/404']);
            observer.next(false);
          }
        ) as Observable<boolean>;
      }
    ));
  }
}
