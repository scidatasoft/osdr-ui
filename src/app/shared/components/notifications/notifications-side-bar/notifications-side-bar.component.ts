import { Component, OnDestroy, OnInit,EventEmitter, NgZone, ElementRef, HostListener } from '@angular/core';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { Subscription , interval } from 'rxjs';
import { NotificationAction, NotificationItem } from '../notifications.model';
import { environment } from 'environments/environment';
import { NotificationsApiService } from 'app/core/services/api/notifications-api.service';


@Component({
  selector: 'dr-notifications-side-bar',
  templateUrl: './notifications-side-bar.component.html',
  styleUrls: ['./notifications-side-bar.component.scss'],
})
export class NotificationsSideBarComponent implements OnInit, OnDestroy {

  private notificationEventSubscription: Subscription;
  private closeEvent = new EventEmitter<NotificationItem>();

  notificationItemList: NotificationItem[] = [];
  notificationsTotalCount;
  params: { pageNumber: number, pageSize: number } = { pageNumber: 1, pageSize: 20 };
  // @HostBinding('style.display') private _display = 'none';
  get display(): boolean {
    return this.notificationsService.isNotificationBarActive;
  }

  set display(value: boolean) {
    this.notificationsService.isNotificationBarActive = value;
  }

  constructor(
    private notificationsService: NotificationsService,
    private notificationsApiService: NotificationsApiService,
    private _ngZone: NgZone,
    private _elref: ElementRef
  ) {
    this.notificationEventSubscription = this.notificationsService.notificationEvent.subscribe(
      (notifyEvent: { action: NotificationAction, item: NotificationItem }) => {
        this.serviceHandlerAction(notifyEvent);
      }
    );
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    if (this.display) {
      if (!(targetElement.closest('dr-notifications-side-bar') || targetElement.closest('dr-notification-item')
        || targetElement.closest('.notifications-pane-block'))) {
        this.onSideBarClose();
      }
    }
  }

  ngOnInit() {
    this.removeExpiredNotifications();
    this.getPersistentNotificationsNumber();
  }

  getPersistentNotificationsNumber() {
    this.notificationsApiService.getNotificationsHead().subscribe(data => {
      this.notificationsTotalCount = data.totalCount;
    });
  }

  serviceHandlerAction(notifyEvent: { action: NotificationAction, item: NotificationItem }) {
    this.notificationItemList = this.notificationsService.getNotificationsList();

    this.notificationItemList = this.notificationItemList.map((x) => {
      x.closeEvent = this.onDismissNotification.bind(this);
      return x;
    });

    if (notifyEvent.action === NotificationAction.ShowBar) {
      this.display = !this.display;
    }
    if (this.display === true) {
      this.notificationsService.setMessagesAsRead();
    }
  }

  onDismissNotification(item: NotificationItem) {
    for (const i of this.notificationItemList) {
      if (i.componentData.id === item.componentData.id) {
        const index = this.notificationItemList.indexOf(i);
        if (index >= 0) {
          this.notificationItemList.splice(index, 1);
          this.notificationsService.removeNotification(item);
          this.notificationsApiService.removePersistentNotification(item.componentData.id);
        }
      }
    }
  }

  onSideBarClose() {
    this.display = false;
  }

  onSideBarClear() {
    this.notificationItemList = [];
    this.notificationsService.removeAllNotifications();
    this.notificationsApiService.removeAllPersistentNotifications();
  }

  removeExpiredNotifications() {
    this._ngZone.runOutsideAngular(() => {
      interval(60 * 60 * 1000 + 5 * 60 * 1000).subscribe(() => {
        this._ngZone.run(() => {
          if (this.notificationItemList.length > 0) {
            this.notificationItemList.forEach((item, index) => {
              const currentDate = new Date;
              const todayDate = currentDate.toLocaleString();
              const expirationDate = (new Date(new Date(item.componentData.actionDate).getTime()
                + environment.notificationTimeOut)).toLocaleString();
              const diffInMs: number = Date.parse(expirationDate) - Date.parse(todayDate);
              const diffInHours: number = diffInMs / 1000 / 60 / 60;
              if (diffInHours <= 0) {
                this.notificationItemList.splice(index, 1);
                this.notificationsService.removeNotification(item);
              }
            });
          }
        });
      });
    });
  }

  ngOnDestroy() {
    this.notificationsService.isNotificationBarActive = false;
    if (this.notificationEventSubscription) {
      this.notificationEventSubscription.unsubscribe();
    }
  }

  showMoreNotifications() {
    this.params = { pageNumber: this.params.pageNumber, pageSize: this.params.pageSize };
    this.notificationsApiService.getPersistentNotificationsList(this.params).subscribe(data => {
      this.notificationsApiService.getNotificationsHead().subscribe(headers => {
        this.notificationsTotalCount = headers.totalCount;
        if (headers.currentPage < headers.totalPages) {
          this.params.pageNumber += 1;
          this.params.pageSize = 20;
          this.notificationsService.getPersistentNotificationList(data).forEach(item => this.notificationItemList.push(item));
        }
      });
    });
  }
}
