import {
  Component, ComponentFactoryResolver, ComponentRef, Input, OnDestroy, OnInit, ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { INotificationComponent, NotificationItem, NotificationMessage } from '../../notifications.model';
import { NotificationCommonItemComponent } from '../notification-common-item/notification-common-item.component';
import { NotificationExportItemComponent } from '../notification-export-item/notification-export-item.component';
import { NotificationProcessItemComponent } from '../notification-process-item/notification-process-item.component';
import { NotificationUploadItemComponent } from '../notification-upload-item/notification-upload-item.component';

@Component({
  selector: 'dr-notification-items-factory',
  templateUrl: './notification-item-factory.component.html',
  styleUrls: ['./notification-item-factory.component.scss'],
  entryComponents: [NotificationCommonItemComponent, NotificationUploadItemComponent, NotificationProcessItemComponent,
                    NotificationExportItemComponent],
})
export class NotificationItemFactoryComponent implements OnInit, OnDestroy {

  private eventSubscription: Subscription;
  @ViewChild('notificationComponentContainer', { read: ViewContainerRef, static: true }) _container: ViewContainerRef;
  @Input()
  set componentData(value: NotificationItem) {
    if (!value) {
      return;
    }

    const cmpFactory = this._resolver.resolveComponentFactory(value.component);
    const component: ComponentRef<INotificationComponent> =
      this._container.createComponent(cmpFactory) as ComponentRef<INotificationComponent>;

    component.instance.notificationItem = value;
    this.eventSubscription = component.instance.closeEvent.subscribe(
      (item: NotificationMessage) => {
        value.closeEvent(item);
      },
    );
  }

  constructor(private _resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}
