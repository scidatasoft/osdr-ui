import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Observable ,  Subject ,  Subscription, of, from } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthService } from '../auth/auth.service';
import { SignalREvent } from 'app/shared/components/notifications/events.model';
import { NotificationsService } from '../notifications/notifications.service';


@Injectable()
export class SignalrService {
  static wasInit = false;
  private organizeUpdateSubject: Subject<any> = new Subject();
  organizeUpdate: Observable<any> = this.organizeUpdateSubject.asObservable();

  private userProfileUpdateSubject: Subject<any> = new Subject();
  userProfileUpdate: Observable<any> = this.userProfileUpdateSubject.asObservable();

  private generalEventsSubject: Subject<any> = new Subject();
  generalEvents: Observable<any> = this.generalEventsSubject.asObservable();

  private exportFinishedSubject: Subject<any> = new Subject();
  exportFinished: Observable<any> = this.exportFinishedSubject.asObservable();

  private connectionStartSubject: Subject<any> = new Subject();
  private subscription: Subscription;

  get getConnection(): Observable<any> {
    if (this.connection) {
      return of(this.connection);
    }
    return this.connectionStartSubject.asObservable();
  }

  connection: any;

  constructor(private auth: AuthService, public ngZone: NgZone, private notification: NotificationsService) {
    if (!this.subscription) {
      this.subscription = this.auth.notificationTokenExpiring.subscribe(
        (user) => {
          this.checkConnection(user);
        },
      );
    }

    this.ngZone.runOutsideAngular(() => {
      auth.getUser().subscribe(user => {
        if (user) {
          this.configure(user);
        }
      });
    });
  }

  configure(user) {
    if (!SignalrService.wasInit) {
      SignalrService.wasInit = true;

      const $ = (window as any).$;
      if (!$ || !$.signalR) {
        console.error('SignalR does not exists');
        return;
      }
      $.signalR.ajaxDefaults.headers = {
        Authorization: user.token_type + ' ' + user.access_token,
      };

      const organizeHubProxy = new signalR.HubConnectionBuilder()
        .withUrl(environment.signalrUrl, { accessTokenFactory: () => user.access_token })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      organizeHubProxy.on('organizeUpdate', (data) => {
        this.ngZone.run(
          () => {
            const signalREvent = new SignalREvent(data);
            this.organizeUpdateSubject.next(signalREvent);
            this.notification.organizeUpdateEvent(signalREvent);
          },
        );
      },
      );

      organizeHubProxy.on('updateNotficationBar', (data) => {
        this.ngZone.run(
          () => {
            const signalREvent = new SignalREvent(data);
            if (data.eventName === 'ExportFinished') {
              this.exportFinishedSubject.next(signalREvent);
              this.notification.exportEvents(signalREvent);
            } else if (data.eventName === 'PermissionsChanged') {
              this.organizeUpdateSubject.next(signalREvent);
              this.notification.permissionsChanged(signalREvent);
            } else {
              this.organizeUpdateSubject.next(signalREvent);
              this.notification.organizeUpdateEvent(signalREvent);
            }
          });
      });

      organizeHubProxy.on('userProfileUpdated',
        (data) => {

          this.ngZone.run(
            () => {
              this.userProfileUpdateSubject.next(data);
            },
          );
        },
      );

      organizeHubProxy.on('generalEvents', (data) => {
        this.ngZone.run(
          () => {
            this.generalEventsSubject.next(new SignalREvent(data));
          },
        );
      },
      );

      organizeHubProxy.start().then(() => {
          SignalrService.wasInit = true;
      });

      organizeHubProxy.onclose((change) => {
          SignalrService.wasInit = false;
      });
    }
  }

  private checkConnection(user) {
    console.log('change signalR token');
    const $ = (window as any).$;
    $.signalR.ajaxDefaults.headers = {
      Authorization: user.token_type + ' ' + user.access_token,
    };
  }

  manualReconnect() {
    if (!SignalrService.wasInit && this.connection) {
      // this.configure(this.auth.user);
      this.connection.start();
    }
  }

  manualReconnectAsObservable(user): Observable<any> {
    if (!SignalrService.wasInit && this.connection) {
      this.checkConnection(user);
      return from(this.connection.start().promise().then(() => user));
    } else {
      return of(user);
    }
  }
}
