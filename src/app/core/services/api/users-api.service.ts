import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserPublicInformation } from 'app/shared/components/organize-browser/browser-types';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UsersApiService {
  requests: any = {};

  constructor(public http: HttpClient) { }

  getEntityCounts(params: string): Observable<any> {
    return this.http.head(environment.apiUrl + `/nodes/?$filter=${params}`, { observe: 'response', responseType: 'text' }).pipe(
      map(
      (x) => {
        return JSON.parse(decodeURIComponent(x.headers.get('x-pagination')));
      },
    ));
  }

  getUserInfo(userId: string): Observable<UserPublicInformation> {
    if (this.requests[userId]) {
      return of(this.requests[userId]);
    } else {
      return this.http.get<UserPublicInformation>(environment.apiUrl + `/users/${userId}/public-info`)
        .pipe(
          map(x => {
          return this.requests[userId] = x;
        }),
      );
    }
  }
}
