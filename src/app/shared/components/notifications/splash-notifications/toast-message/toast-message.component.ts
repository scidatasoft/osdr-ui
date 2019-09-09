import {Component, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';

import {NotificationType} from '../../events.model';
import {NotificationMessage} from '../../notifications.model';

@Component({
  selector: 'dr-toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.scss'],
})
export class ToastMessageComponent implements OnInit {

  @Input('messageItem') messageItem: NotificationMessage = new NotificationMessage();
  @Output() closeEvent = new EventEmitter<NotificationMessage>();
  notificationType = NotificationType;

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.ngZone.runOutsideAngular(
      () => {
        setTimeout(
          () => {
            this.ngZone.run(
              () => {
                this.onCloseToast();
              },
            );
          },
          3000,
        );
      },
    );
  }

  onCloseToast() {
    this.closeEvent.emit(this.messageItem);
  }
}
