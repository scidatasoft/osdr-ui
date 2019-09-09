import { Component, EventEmitter, HostListener, Input, NgZone, OnInit, Output } from '@angular/core';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { Subscription } from 'rxjs';

import { NotificationType } from '../../events.model';
import {
  INotificationComponent, NotificationItem,
  NotificationUploadMessage,
} from '../../notifications.model';

@Component({
  selector: 'dr-notification-upload-item',
  templateUrl: './notification-upload-item.component.html',
  styleUrls: ['./notification-upload-item.component.scss'],
})
export class NotificationUploadItemComponent implements OnInit, INotificationComponent {

  showCloseButton = false;
  notificationType = NotificationType;
  messageItem: NotificationUploadMessage = new NotificationUploadMessage();

  @Input('notificationItem') notificationItem: NotificationItem;
  @Output() closeEvent = new EventEmitter<NotificationItem>();

  taskSubscription: Subscription;
  inProgress = false;

  constructor(private ngZone: NgZone, private notificationsService: NotificationsService) {
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.showCloseButton = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.showCloseButton = false;
  }

  ngOnInit() {
    this.messageItem = this.notificationItem.componentData as NotificationUploadMessage;
    if (!this.messageItem.finished) {
      this.startProgress();
    }
  }

  startProgress() {
    this.ngZone.runOutsideAngular(
      () => {
        this.messageItem.type = NotificationType.Process;
        this.taskSubscription = this.messageItem.uploadTask.subscribe(
          (response) => {
            this.ngZone.run(
              () => {
                if (this.inProgress === false
                  && !this.messageItem.finished
                  && !this.messageItem.canceled
                  && !this.messageItem.finishedWithError) {
                  this.inProgress = true;
                  this.finishTasks(response);
                }
              },
            );
          },
          (error) => {
            this.ngZone.run(
              () => {
                this.finishTasksWithError();
              },
            );
          },
        );
      },
    );
  }

  restartUpload() {
    this.messageItem.canceled = false;
    this.messageItem.finishedWithError = false;
    this.startProgress();
  }

  cancelTask() {
    this.taskSubscription.unsubscribe();
    this.messageItem.canceled = true;
    this.inProgress = false;
    this.messageItem.type = NotificationType.Warning;
  }

  finishTasks(bucketIdArray?: string[]) {
    if (bucketIdArray && Array.isArray(bucketIdArray) && bucketIdArray.length) {
      this.messageItem.bucketId = bucketIdArray[0];
    }
    this.messageItem.finished = true;
    this.inProgress = false;
    this.messageItem.type = NotificationType.Success;
    this.notificationsService.updateItem(this.notificationItem);
  }

  finishTasksWithError() {
    this.messageItem.finishedWithError = true;
    this.inProgress = false;
    this.messageItem.type = NotificationType.Error;
  }

  onCloseMessage() {
    this.closeEvent.emit(this.notificationItem);
  }
}
