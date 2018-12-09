import { Component, OnInit, EventEmitter, Input, Output, HostListener } from '@angular/core';
import {
  INotificationComponent, NotificationItem, NotificationExportMessage
} from 'app/shared/components/notifications/notifications.model';
import { BlobsApiService } from 'app/core/services/api/blobs-api.service';
import {NotificationType} from '../../events.model';

@Component({
  selector: 'dr-notification-export-item',
  templateUrl: './notification-export-item.component.html',
  styleUrls: ['./notification-export-item.component.scss']
})
export class NotificationExportItemComponent implements OnInit, INotificationComponent {
  showCloseButton = false;
  notificationType = NotificationType;
  messageItem: NotificationExportMessage = new NotificationExportMessage();

  @Input('notificationItem') notificationItem: NotificationItem;
  @Output() closeEvent = new EventEmitter<NotificationItem>();

  @HostListener('mouseenter') onMouseEnter() {
    this.showCloseButton = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.showCloseButton = false;
  }

  constructor(private blobsApi: BlobsApiService) { }

  ngOnInit() {
    this.messageItem = this.notificationItem.componentData as NotificationExportMessage;
  }

  downloadFile() {
    const blobUrl = this.blobsApi.getExportFileUrl(this.messageItem, true);
    window.open(blobUrl, '_self');
  }

  onCloseMessage() {
    this.closeEvent.emit(this.notificationItem);
  }
}
