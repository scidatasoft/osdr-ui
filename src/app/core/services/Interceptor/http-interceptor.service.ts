import { Injectable, Injector } from '@angular/core';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationItem, NotificationMessage } from 'app/shared/components/notifications/notifications.model';
import { environment } from 'environments/environment';
import { NotificationType } from 'app/shared/components/notifications/events.model';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private notificationService: NotificationsService, private injector: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<HttpEventType.Response>> {
    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse) {
        const excludeUrl = `${environment.apiUrl}/users/`;
        const excludeMetaDate = `/metadata/`;
        let isItUserUrl = false;

        if (error.url && (error.url.includes(excludeUrl) || error.url.includes(excludeMetaDate))) {
          isItUserUrl = true;
        }
        if (((error.status < 200 || error.status >= 300) && isItUserUrl === false)
          || (isItUserUrl === true && (error.status < 200 || error.status >= 300) && error.status !== 404)) {
          const code = error.status || '';
          const text = error.status ? error.statusText : 'Timeout error';
          let messageBody = `Bad response status: ${code} ${text}`;

          if (code === 413) {
            const maxFileSize = environment.maxBlobUploadingFileSize / 1024 / 1024;
            messageBody = `File size exceeded: ${maxFileSize}MB`;
          }
          this.notificationService.showToastNotification(new NotificationItem(null,
            NotificationMessage.CreateCommonMessage(NotificationType.Error, 'Error', messageBody)),
            false);
        }
      }
      return throwError(error);
    }));
  }
}
