import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class NotificationsApiService {
  constructor(private http: HttpClient) {}

  getPersistentNotificationsList(params?: { pageNumber: number; pageSize: number }) {
    if (!params) {
      params = { pageNumber: 1, pageSize: 20 };
    }
    return this.http
      .get(
        `${environment.apiUrl}/usernotifications/?PageNumber=${params.pageNumber}&PageSize=${params.pageSize}&undreadOnly=true?version=1`,
        { observe: 'response' },
      )
      .pipe(
        map(data => {
          return data.body;
        }),
      );
  }

  getNotificationsHead(params?: { pageNumber: number; pageSize: number }) {
    if (!params) {
      params = { pageNumber: 1, pageSize: 20 };
    }

    return this.http
      .get(
        `${environment.apiUrl}/usernotifications/?PageNumber=${params.pageNumber}
    &PageSize=${params.pageSize}&undreadOnly=true?version=1`,
        { observe: 'response', responseType: 'text' },
      )
      .pipe(
        map(x => {
          return JSON.parse(decodeURIComponent(x.headers.get('x-pagination')));
        }),
      );
  }

  removePersistentNotification(id: string) {
    this.http.delete(`${environment.apiUrl}/usernotifications/${id}`).subscribe(response => {});
  }

  removeAllPersistentNotifications() {
    this.http.delete(`${environment.apiUrl}/usernotifications`).subscribe(response => {});
  }
}
