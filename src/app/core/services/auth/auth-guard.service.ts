import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.getUser().pipe(
      map(user => {
        if (!user && environment.capabilities.login) {
          localStorage.setItem('redirectUrl', state.url);
          this.router.navigate(['/login']);
          this.auth.login();

          return false;
        } else if (!environment.capabilities.login) {
          if (this.router.url !== '/') {
            this.router.navigate(['/']);
          }

          return false;
        } else {
          return true;
        }
      }),
      catchError(error => {
        return Observable.create(observer => {
          this.router.navigate(['/home']);
          observer.next(false);
        }) as Observable<boolean>;
      }),
    );
  }
}
