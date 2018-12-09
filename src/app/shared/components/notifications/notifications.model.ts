import { EventEmitter, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { NodeEvent, NotificationType, SignalREvent, SignalREventExportFinished, SignalREventPermissionChanged } from './events.model';
import { NodeType } from '../organize-browser/browser-types';

export enum NotificationAction {
  SplashMessage,
  ShowBar,
  AddNotification
}

export class NotificationMessage {
  id: string;
  type: NotificationType;
  header: string;
  message: string;
  actionDate: Date;
  link: string;

  static CreateOrganizeUpdateEventMessage(event: SignalREvent): NotificationMessage {
    if ([NodeEvent.FileCreated, NodeEvent.FolderCreated,
        NodeEvent.FileDeleted, NodeEvent.FolderDeleted,
        NodeEvent.FileNameChanged, NodeEvent.FolderNameChanged,
        NodeEvent.FileMoved, NodeEvent.FolderMoved,
        NodeEvent.ProcessingFinished, NodeEvent.PropertiesPredictionFinished,
        NodeEvent.ModelTrainingFinished, NodeEvent.TrainingFailed,
        NodeEvent.ReportGenerationFailed, NodeEvent.TotalRecordsUpdated].includes(event.getNodeEvent())) {
      if (event.EventData) {
        const message = new NotificationMessage();

        message.id = event.NotificationId;
        message.header = event.EventData.getEventHeader();
        message.message = event.EventData.getEventDescription();
        message.actionDate = event.EventData.getDate();
        message.type = event.EventData.getNotificationType();
        message.link = event.EventData.getLink();
        return message;
      }
    }
    return null;
  }

  static CreateExportMessage(event: SignalREvent): NotificationMessage {
    const message = new NotificationExportMessage();

    message.id = event.NotificationId;
    message.header = event.EventData.getEventHeader();
    message.message = event.EventData.getEventDescription();
    message.actionDate = event.EventData.getDate();
    message.type = event.EventData.getNotificationType();
    message.ExportBucket = (event.EventData as SignalREventExportFinished).ExportBucket;
    message.ExportBlobId = (event.EventData as SignalREventExportFinished).ExportBlobId;
    return message;
  }

  static CreatePermissionChanged(event: SignalREvent): NotificationMessage {
    const message = new NotificationPermissionChanged();
    message.id = event.NotificationId;
    message.header = event.EventData.getEventHeader();
    message.message = event.EventData.getEventDescription();
    message.actionDate = event.EventData.getDate();
    message.type = event.EventData.getNotificationType();
    message.accessPermissions = {
      groups: (event.EventData as SignalREventPermissionChanged).permissionGroups,
      users: (event.EventData as SignalREventPermissionChanged).permissionUsers,
      isPublic: (event.EventData as SignalREventPermissionChanged).permissionPublic
    };
    return message;
  }

  static CreateCommonMessage(type: NotificationType, header: string, messageBody: string): NotificationMessage {
    const message = new NotificationMessage();

    message.id = message.generateIdIg();
    message.type = type;
    message.header = header;
    message.message = messageBody;
    return message;
  }

  generateIdIg(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}

export class NotificationUploadMessage extends NotificationMessage {
  uploadTask: Observable<any>;
  parentId: string;
  canceled = false;
  finished = false;
  finishedWithError = false;
  bucketId: string;
}

export class NotificationExportMessage extends NotificationMessage {
  ExportBucket: string;
  ExportBlobId: string;
}

export class NotificationPermissionChanged extends NotificationMessage {
  accessPermissions: INotificationPermission;
}

export class NotificationItem {
  id: string;
  component: Type<any>;
  componentData: NotificationMessage;
  closeEvent: (item: NotificationMessage) => void;
  wasRead = false;

  constructor(component: Type<any>, componentData: any) {
    this.component = component;
    this.componentData = componentData;
    this.id = componentData.NotificationId;
  }

  generateIdIg(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}

export interface INotificationComponent {
  notificationItem: NotificationItem;
  closeEvent: EventEmitter<NotificationItem>;
  notificationType: any;
}
export interface INotificationPermission {
  groups: string[];
  isPublic: boolean;
  users: string[];
}
