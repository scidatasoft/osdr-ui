import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationAction, NotificationMessage, NotificationItem } from 'app/shared/components/notifications/notifications.model';
import {
  NotificationCommonItemComponent
} from 'app/shared/components/notifications/notifications-side-bar/notification-common-item/notification-common-item.component';
import { SignalREvent, NodeEvent } from 'app/shared/components/notifications/events.model';
import {
  NotificationExportItemComponent
} from 'app/shared/components/notifications/notifications-side-bar/notification-export-item/notification-export-item.component';

@Injectable()
export class NotificationsService {

  notificationEvent: Subject<{ action: NotificationAction, item: NotificationItem }> = new Subject();
  notificationsList: NotificationItem[] = [];
  private _isNotificationBarActive = false;

  constructor() {
  }

  get isNotificationBarActive(): boolean {
    return this._isNotificationBarActive;
  }

  set isNotificationBarActive(value: boolean) {
    this._isNotificationBarActive = value;
  }

  organizeUpdateEvent(event: SignalREvent) {
    const message = NotificationMessage.CreateOrganizeUpdateEventMessage(event);
    if (message) {
      this.showToastNotification(new NotificationItem(NotificationCommonItemComponent, message));
    }
  }

  exportEvents(event: SignalREvent) {
    const message = NotificationMessage.CreateExportMessage(event);
    if (message) {
      this.showToastNotification(new NotificationItem(NotificationExportItemComponent, message));
    }
  }

  permissionsChanged(event: SignalREvent) {
    const message = NotificationMessage.CreatePermissionChanged(event);
    if (message) {
      this.showToastNotification(new NotificationItem(NotificationCommonItemComponent, message));
    }
  }

  private sendNotificationEvent(action: NotificationAction, item: NotificationItem) {
    this.notificationEvent.next({ action, item });
  }

  showToastNotification(item: NotificationItem, changeCounterBadge = true) {
    if (changeCounterBadge) {
      this.addNotification(item);
    }

    if (!this.isNotificationBarActive) {
      this.sendNotificationEvent(NotificationAction.SplashMessage, item);
    }
  }

  showNotificationBar() {
    this.sendNotificationEvent(NotificationAction.ShowBar, null);
  }

  private addNotification(item: NotificationItem) {
    this.notificationsList.unshift(item);
    this.sendNotificationEvent(NotificationAction.AddNotification, item);
  }

  loadPersistentNotificationsList(): NotificationItem[] {
    this.notificationsList.forEach(x => {
      x.closeEvent = this.removeNotification.bind(this);
    });
    return this.notificationsList;
  }

  getPersistentNotificationList(persistentNotificationList): NotificationItem[] {
    const persistentList = [];
    for (const notificationId in persistentNotificationList) {
      if (persistentNotificationList.hasOwnProperty(notificationId)) {
        const persistentNotification = persistentNotificationList[notificationId];
        persistentNotification.eventName = persistentNotification.eventTypeName;
        const signalREvent = new SignalREvent(persistentNotification);
        switch (signalREvent.EventName) {
          case 'ExportFinished':
            const exportMessage = NotificationMessage.CreateExportMessage(signalREvent);
            const exportNotification = new NotificationItem(NotificationExportItemComponent, exportMessage);
            exportMessage.id = persistentNotification.id;
            persistentList.push(exportNotification);
            break;
          case 'PermissionsChanged':
            const permissionChangedMessage = NotificationMessage.CreatePermissionChanged(signalREvent);
            if (permissionChangedMessage) {
              const permissionNotification = new NotificationItem(NotificationCommonItemComponent, permissionChangedMessage);
              permissionChangedMessage.id = persistentNotification.id;
              persistentList.push(permissionNotification);
            }
            break;
          default:
            const organizeUpdateMessage = NotificationMessage.CreateOrganizeUpdateEventMessage(signalREvent);
            if (organizeUpdateMessage) {
              const notification = new NotificationItem(NotificationCommonItemComponent, organizeUpdateMessage);
              organizeUpdateMessage.id = persistentNotification.id;
              persistentList.push(notification);
            }
            break;
        }
      }
    }
    this.notificationsList = persistentList;
    return this.notificationsList;
  }

  getNotificationsList(): NotificationItem[] {
    return this.notificationsList;
  }

  getNotReadItemsCount(): number {
    let itemsCount = 0;
    for (const i of this.notificationsList) {
      if (!i.wasRead) {
        itemsCount++;
      }
    }
    return itemsCount;
  }

  setMessagesAsRead() {
    for (const i of this.notificationsList) {
      if (!i.wasRead) {
        i.wasRead = true;
      }
    }
  }

  removeNotification(item: NotificationItem) {
    for (const i of this.notificationsList) {
      if (i.id === item.id) {
        const index = this.notificationsList.indexOf(i);
        if (index >= 0) {
          this.notificationsList.splice(index, 1);
        }
      }
    }
  }

  removeAllNotifications() {
    this.notificationsList = [];
  }

  updateItem(item: NotificationItem) {
    for (const i of this.notificationsList) {
      if (i.id === item.id) {
        i.componentData = item.componentData;
      }
    }
  }
}
