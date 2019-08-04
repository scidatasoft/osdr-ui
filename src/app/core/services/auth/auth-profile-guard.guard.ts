import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from 'oidc-client';
import { map, catchError, flatMap } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class AuthProfileGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!environment.capabilities.login) {
      this.router.navigate(['/home']);
      return false;
    }

    return this.auth.getUser().pipe(
      flatMap((user: User) => {
        if (user) {
          return this.auth.askAboutProfile(user.profile).pipe(
            map(userResponse => {
              return true;
            }),
            catchError(error => {
              this.router.navigate(['/home']);
              return of(false);
            }),
          );
        } else {
          of(false);
        }
      }),
      catchError(error => {
        this.router.navigate(['/home']);
        return of(false);
      }),
    );
  }
}
