import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {INotificationComponent, NotificationItem, NotificationMessage} from '../../notifications.model';
import {NotificationType} from '../../events.model';

@Component({
  selector: 'dr-notification-process-item',
  templateUrl: './notification-process-item.component.html',
  styleUrls: ['./notification-process-item.component.scss']
})
export class NotificationProcessItemComponent implements OnInit, INotificationComponent {

  showCloseButton = false;
  notificationType = NotificationType;
  messageItem: NotificationMessage = new NotificationMessage();

  @Input('notificationItem') notificationItem: NotificationItem;
  @Output() closeEvent = new EventEmitter<NotificationItem>();

  @HostListener('mouseenter')
  onMouseEnter() {
    this.showCloseButton = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.showCloseButton = false;
  }

  constructor() { }

  ngOnInit() {
    this.messageItem = this.notificationItem.componentData;
  }

  onCloseMessage() {
    this.closeEvent.emit(this.notificationItem);
  }
}
