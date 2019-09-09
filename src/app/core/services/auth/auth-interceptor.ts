import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { User } from 'oidc-client';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { SignalrService } from '../signalr/signalr.service';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<HttpEventType.Response>> {
    return this.auth
      .getUser()
      .pipe(
        flatMap(userOidc => {
          const signalR: SignalrService = this.injector.get(SignalrService);
          return signalR.manualReconnectAsObservable(userOidc);
        }),
      )
      .pipe(
        flatMap<User, Observable<any>>(user => {
          if (!user) {
            return next.handle(req);
          }

          const request = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user.access_token}`,
            },
          });
          return next.handle(request);
        }),
      );
  }
}
