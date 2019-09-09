import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {NotificationsService} from 'app/core/services/notifications/notifications.service';
import {Subscription} from 'rxjs';

import {NotificationAction, NotificationItem, NotificationMessage} from '../notifications.model';

@Component({
  selector: 'dr-splash-notification',
  templateUrl: './splash-notifications.component.html',
  styleUrls: ['./splash-notifications.component.scss'],
})
export class SplashNotificationsComponent implements OnInit, OnDestroy {

  messagesList: NotificationMessage[] = [];
  private notificationEventSubscription: Subscription;

  constructor(private notificationsService: NotificationsService, private _elref: ElementRef) {
    this.notificationEventSubscription = this.notificationsService.notificationEvent.subscribe(
      (notifyEvent: { action: NotificationAction, item: NotificationItem }) => {
        this.serviceHandlerAction(notifyEvent);
      },
    );
    document.addEventListener('click', this.onCloseToast.bind(this));
  }

  ngOnInit() {
  }

  onCloseToast($event, item: NotificationMessage) {
    const index = this.messagesList.indexOf(item);
    if (index >= 0 || !this._elref.nativeElement.contains($event.target)) {
      this.messagesList.splice(index, 1);
    }
  }

  serviceHandlerAction(notifyEvent: { action: NotificationAction, item: NotificationItem }) {
    if (notifyEvent.action === NotificationAction.SplashMessage) {
      this.messagesList.unshift(notifyEvent.item.componentData);
      if (this.messagesList.length > 7) {
        this.messagesList.pop();
      }
    }
  }

  ngOnDestroy() {
    if (this.notificationEventSubscription) {
      this.notificationEventSubscription.unsubscribe();
    }
  }
}
