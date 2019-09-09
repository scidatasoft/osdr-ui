import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// import { SharedModule } from 'app/shared/shared.module';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';

import { NotificationCommonItemComponent } from './notifications-side-bar/notification-common-item/notification-common-item.component';
import { NotificationExportItemComponent } from './notifications-side-bar/notification-export-item/notification-export-item.component';
import { NotificationItemFactoryComponent } from './notifications-side-bar/notification-item-factory/notification-item-factory.component';
import { NotificationProcessItemComponent } from './notifications-side-bar/notification-process-item/notification-process-item.component';
import { NotificationUploadItemComponent } from './notifications-side-bar/notification-upload-item/notification-upload-item.component';
import { NotificationsSideBarComponent } from './notifications-side-bar/notifications-side-bar.component';
import { SplashNotificationsComponent } from './splash-notifications/splash-notifications.component';
import { ToastMessageComponent } from './splash-notifications/toast-message/toast-message.component';

const components = [
  NotificationCommonItemComponent,
  NotificationExportItemComponent,
  NotificationItemFactoryComponent,
  NotificationProcessItemComponent,
  NotificationUploadItemComponent,
  NotificationsSideBarComponent,
  ToastMessageComponent,
  SplashNotificationsComponent,
];

@NgModule({
  imports: [CommonModule, SharedModule, MatTooltipModule, MatButtonModule],
  exports: [...components],
  declarations: [...components],
  providers: [],
})
export class NotificationsModule { }
