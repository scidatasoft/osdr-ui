import { Location } from '@angular/common';
import { INotificationPermission } from 'app/shared/components/notifications/notifications.model';

import { NodeType } from '../organize-browser/browser-types';

export enum NotificationType {
  Info,
  Error,
  Warning,
  Success,
  Process,
}

export enum NodeEvent {
  FileCreated,
  FileNameChanged,
  FileDeleted,
  FileMoved,
  FolderCreated,
  FolderNameChanged,
  FolderMoved,
  FolderDeleted,
  StatusChanged,
  TotalRecordsUpdated,
  ImageAdded,
  ExportFinished,
  PermissionsChanged,
  ProcessingFinished,
  ProcessingStarted,
  PropertiesPredictionFinished,
  ReportGenerationFailed,
  ModelTrainingFinished,
  TrainingFailed,
}

export enum FolderStatus {
  Created = 1,
  Processing,
  Processed,
}

export enum FileStatus {
  Loading = 1,
  Loaded,
  Parsing,
  Parsed,
  Processing,
  Processed,
  Failed,
}

export enum RecordStatus {
  Created = 1,
  Processing,
  Processed,
  Failed,
}

export enum ModelStatus {
  Created = 1,
  Processing,
  Processed,
  Failed,
}

export class SignalREventDataBasic {
  id: string;
  timeStamp: string;
  userId: string;
  version: number;
  nodeType: NodeType;
  eventType: NodeEvent;

  constructor(data?: { id: string, timeStamp: string, userId: string, version: number }) {
    if (data) {
      this.id = data.id;
      this.timeStamp = data.timeStamp;
      this.userId = data.userId;
      this.version = data.version;
    }
  }

  getDate(): Date {
    return new Date(this.timeStamp);
  }

  getLink(): string {
    return '/organize/drafts';
  }

  getEventHeader() {
    if (this.eventType === NodeEvent.FileDeleted || this.eventType === NodeEvent.FolderDeleted) {
      return `${NodeType[this.nodeType]} Deleted`;
    }
    return `${NodeType[this.nodeType]} Action`;
  }

  getEventDescription(): string {
    let description = NodeType[this.nodeType];
    if (this.eventType === NodeEvent.FileDeleted || this.eventType === NodeEvent.FolderDeleted) {
      description += ' was deleted.';
    }
    return description;
  }

  getNotificationType(): NotificationType {
    return NotificationType.Info;
  }

  static Create(nodeType: NodeType, eventType: NodeEvent, data: any): SignalREventDataBasic {
    let signalRObject: SignalREventDataBasic = new SignalREventDataBasic(data);
    if (nodeType === NodeType.Folder) {
      switch (eventType) {
        case NodeEvent.FolderCreated: {
          signalRObject = new SignalREventDataFolderCreated(data);
          break;
        }
        case NodeEvent.FolderMoved: {
          signalRObject = new SignalREventDataMove(data);
          break;
        }
        case NodeEvent.FolderNameChanged: {
          signalRObject = new SignalREventDataRename(data);
          break;
        }
      }
    } else if (nodeType === NodeType.Model) {
      switch (eventType) {
        case NodeEvent.ProcessingFinished: {
          signalRObject = new SignalREventProcessingFinished(data);
          break;
        }
        case NodeEvent.ProcessingStarted: {
          signalRObject = new SignalREventDataStatus(data);
          break;
        }
        case NodeEvent.FileNameChanged: {
          signalRObject = new SignalREventDataRename(data);
          break;
        }
        case NodeEvent.PermissionsChanged: {
          signalRObject = new SignalREventPermissionChanged(data);
          break;
        }
        case NodeEvent.ModelTrainingFinished: {
          signalRObject = new SignalREventModelTraining(data);
          break;
        }
        case NodeEvent.TrainingFailed: {
          signalRObject = new SignalREventModelTraining(data);
          break;
        }
        case NodeEvent.ReportGenerationFailed: {
          signalRObject = new SignalREventModelTraining(data);
          break;
        }
      }
    } else if (nodeType === NodeType.File) {
      switch (eventType) {
        case NodeEvent.FileCreated: {
          signalRObject = new SignalREventDataFileCreated(data);
          break;
        }
        case NodeEvent.FileMoved: {
          signalRObject = new SignalREventDataMove(data);
          break;
        }
        case NodeEvent.FileNameChanged: {
          signalRObject = new SignalREventDataRename(data);
          break;
        }
        case NodeEvent.ExportFinished: {
          signalRObject = new SignalREventExportFinished(data);
          break;
        }
        case NodeEvent.PermissionsChanged: {
          signalRObject = new SignalREventPermissionChanged(data);
          break;
        }
        case NodeEvent.PropertiesPredictionFinished: {
          signalRObject = new SignalREventProcessingFinished(data);
          break;
        }
      }
    } else if (nodeType === NodeType.Record) {
      switch (eventType) {
        case NodeEvent.PermissionsChanged: {
          signalRObject = new SignalREventPermissionChanged(data);
          break;
        }
      }
    }

    if (!signalRObject && eventType === NodeEvent.StatusChanged) {
      signalRObject = new SignalREventDataStatus(data);
    }
    signalRObject.nodeType = nodeType;
    signalRObject.eventType = eventType;

    return signalRObject;
  }
}

export class SignalREventDataFolderCreated extends SignalREventDataBasic {
  id: string;
  name: string;
  parentId: string;
  status: number;

  constructor(data: { id: string; timeStamp: string; userId: string; version: number, name: string, parentId: string, status: number }) {
    if (data) {
      super(data);
      this.id = data.id;
      this.name = data.name;
      this.parentId = data.parentId;
      this.status = data.status;
    } else {
      super();
    }
  }

  getLink(): string {
    return `/organize/${this.id}`;
  }

  getEventHeader() {
    return `${NodeType[this.nodeType]} Created`;
  }

  getEventDescription(): string {
    return `${NodeType[this.nodeType]} \'${this.name}\' was created`;
  }

  getNotificationType(): NotificationType {
    return NotificationType.Success;
  }
}

export class SignalREventDataFileCreated extends SignalREventDataBasic {
  blobId: string;
  bucket: string;
  fileName: string;
  fileStatus: number;
  fileType: number;
  length: number;
  md5: string;
  parentId: string;

  constructor(data?: any) {
    if (data) {
      super(data);
      this.blobId = data.blobId;
      this.bucket = data.bucket;
      this.fileName = data.fileName;
      this.fileStatus = data.fileStatus;
      this.fileType = data.fileType;
      this.length = data.length;
      this.md5 = data.md5;
      this.parentId = data.parentId;
    } else {
      super();
    }
  }

  getLink(): string {
    return `/${NodeType[this.nodeType].toLowerCase()}/${this.id}`;
  }

  getEventHeader() {
    return `${NodeType[this.nodeType]} Created`;
  }

  getEventDescription(): string {
    return `${NodeType[this.nodeType]} \'${this.fileName}\' was created`;
  }

  getNotificationType(): NotificationType {
    return NotificationType.Info;
  }
}

export class SignalREventDataRename extends SignalREventDataBasic {
  id: string;
  newName: string;
  oldName: string;

  constructor(data?: { id: string; timeStamp: string; userId: string; version: number, newName: string, oldName: string }) {
    if (data) {
      super(data);
      this.id = data.id;
      this.newName = data.newName;
      this.oldName = data.oldName;
    } else {
      super();
    }
  }

  getLink(): string {
    return NodeType[this.nodeType] === NodeType[NodeType.Folder] ? `/organize/${this.id}` : `/${NodeType[this.nodeType].toLowerCase()}/${this.id}`;
  }

  getEventHeader() {
    return `${NodeType[this.nodeType]} Renamed`;
  }

  getEventDescription(): string {
    return `${NodeType[this.nodeType]} \'${this.newName}\' was renamed`;
  }
}

export class SignalREventExportFinished extends SignalREventDataBasic {
  status: number;
  ExportBlobId: string;
  ExportBucket: string;
  filename: string;

  constructor(data?: {
    id: string; timeStamp: string; userId: string; version: number, exportBlobId: string,
    exportBucket: string, filename: string
  }) {
    if (data) {
      super(data);
      this.ExportBlobId = data.exportBlobId;
      this.ExportBucket = data.exportBucket;
      this.filename = data.filename;
    } else {
      super();
    }
  }

  getEventHeader() {
    return `${NodeType[this.nodeType]} Export Finished`;
  }

  getEventDescription(): string {
    return `Export Finished: ${this.filename}`;
  }

  getNotificationType(): NotificationType {
    return NotificationType.Success;
  }
}

export class SignalREventPermissionChanged extends SignalREventDataBasic {
  id: string;
  status: number;

  permissionGroups: string[];
  permissionUsers: string[];
  permissionPublic: boolean;

  constructor(data?: { id: string; timeStamp: string; userId: string; version: number, accessPermissions: INotificationPermission }) {

    if (data && data.accessPermissions) {
      super(data);

      this.id = data.id;
      this.permissionGroups = data.accessPermissions.groups;
      this.permissionUsers = data.accessPermissions.users;
      this.permissionPublic = data.accessPermissions.isPublic;
    } else {
      super();
    }
  }

  getLink(): string {
    return NodeType[this.nodeType] === NodeType[NodeType.Folder] ? `/organize/${this.id}` : `/${NodeType[this.nodeType].toLowerCase()}/${this.id}`;
  }

  getEventHeader() {
    return `${NodeType[this.nodeType]} Permission Changed`;
  }

  getEventDescription(): string {
    if (this.permissionPublic) {
      return `Public URL Link Created`;
    } else {
      return 'Public URL Link Removed';
    }
  }

  getNotificationType(): NotificationType {
    if (this.permissionPublic) {
      return NotificationType.Success;
    } else {
      return NotificationType.Info;
    }
  }
}

export class SignalREventDataMove extends SignalREventDataBasic {
  newParentId: string;
  oldParentId: string;
  targetFolderName: string;
  targetFolderId: string;

  constructor(
    data?: {
      id: string, timeStamp: string, userId: string,
      version: number, newParentId: string, oldParentId: string,
      targetFolderName: string, targetFolderId: string,
    },
    ) {
    if (data) {
      super(data);
      this.newParentId = data.newParentId;
      this.oldParentId = data.oldParentId;
      this.targetFolderName = data.targetFolderName;
      this.targetFolderId = data.targetFolderId;
    } else {
      super();
    }
  }

  getLink(): string {
    return NodeType[this.nodeType] === NodeType[NodeType.Folder] ? `/organize/${this.id}` : `/organize/${this.newParentId}`;
  }

  getEventHeader() {
    return `${NodeType[this.nodeType]} Moved`;
  }

  getEventDescription(): string {
    return `${NodeType[this.nodeType]} was moved to ${this.targetFolderName}`;
  }
}

export class SignalREventDataStatus extends SignalREventDataBasic {
  status: number;

  constructor(data?: { id: string; timeStamp: string; userId: string; version: number, status: number }) {
    if (data) {
      super(data);
      this.status = data.status;
    } else {
      super();
    }
  }

  getEventHeader() {
    return `${NodeType[this.nodeType]} Status Changed`;
  }

  getEventDescription(): string {
    return `${NodeType[this.nodeType]} status was changed`;
  }
}

export class SignalREventProcessingFinished extends SignalREventDataBasic {
  id: string;
  message: string;
  status: string;

  constructor(data?: { id: string, userId: string, timeStamp: string, status: string, message: string, version: number }) {
    if (data) {
      super(data);
      this.id = data.id;
      this.message = data.message;
      this.status = data.status;
    } else {
      super();
    }
  }

  getLink(): string {
    return `/${NodeType[this.nodeType].toLowerCase()}/${this.id}`;
  }

  getEventHeader() {
    return `${NodeType[this.nodeType]} Processing Finished`;
  }

  getEventDescription(): string {
    return this.message;
  }

  getNotificationType(): NotificationType {
    if (this.status === 'Failed' || this.status === '4') {
      return NotificationType.Error;
    } else {
      return NotificationType.Success;
    }
  }
}

export class SignalREventModelTraining extends SignalREventDataBasic {
  id: string;
  message: string;
  status: number;

  constructor(data?: { id: string, userId: string, timeStamp: string, status: number, message: string, version: number }) {
    if (data) {
      super(data);
      this.id = data.id;
      this.message = data.message;
      this.status = data.status;
    } else {
      super();
    }
  }

  getLink(): string {
    return `/${NodeType[this.nodeType].toLowerCase()}/${this.id}`;
  }

  getEventHeader() {
    return `${NodeType[this.nodeType]} Training Finished`;
  }

  getEventDescription(): string {
    if (this.status === ModelStatus.Failed) {
      return this.message = this.message ? this.message : 'Training Failed';
    } else if (this.status !== ModelStatus.Failed) {
      return this.message = 'Training Finished';
    }
  }

  getNotificationType(): NotificationType {
    if (this.status === ModelStatus.Failed) {
      return NotificationType.Error;
    } else {
      return NotificationType.Success;
    }
  }
}

export class SignalREvent {
  private static deleteMoveActions: NodeEvent[] = [
    NodeEvent.FileDeleted, NodeEvent.FolderDeleted,
    NodeEvent.FileMoved, NodeEvent.FolderMoved,
  ];
  // renameAddActions - call data refresh on node/entity
  private static renameAddActions: NodeEvent[] = [
    NodeEvent.FileCreated, NodeEvent.FileNameChanged,
    NodeEvent.FolderCreated, NodeEvent.FolderNameChanged, NodeEvent.ImageAdded, NodeEvent.StatusChanged,
    NodeEvent.ProcessingFinished, NodeEvent.ProcessingStarted, NodeEvent.PropertiesPredictionFinished,
    NodeEvent.ModelTrainingFinished, NodeEvent.TrainingFailed,
  ];

  Id: string;
  NotificationId: string;
  EventName: string;
  NodeType: string;
  EventData: SignalREventDataBasic;

  constructor(data: { id: string, nodeId: string, eventName: string, nodeType: string, eventPayload: SignalREventDataBasic }) {
    if (data) {
      this.Id = data.nodeId;
      this.NotificationId = data.id;
      this.EventName = data.eventName;
      this.NodeType = data.nodeType;
      this.EventData = SignalREventDataBasic.Create(this.getNodeType(), this.getNodeEvent(), data.eventPayload);
    }
  }

  getNodeType(): NodeType {
    if (this.NodeType === NodeType[NodeType.Folder]) {
      return NodeType.Folder;
    } else if (this.NodeType === NodeType[NodeType.File]) {
      return NodeType.File;
    } else if (this.NodeType === NodeType[NodeType.Record]) {
      return NodeType.Record;
    } else if (this.NodeType === NodeType[NodeType.Report]) {
      return NodeType.Report;
    } else if (this.NodeType === NodeType[NodeType.User]) {
      return NodeType.User;
    } else if (this.NodeType === NodeType[NodeType.Model]) {
      return NodeType.Model;
    }
  }

  getNodeEvent(): NodeEvent {
    if (this.EventName === NodeEvent[NodeEvent.FolderCreated]) {
      return NodeEvent.FolderCreated;
    } else if (this.EventName === NodeEvent[NodeEvent.FolderMoved]) {
      return NodeEvent.FolderMoved;
    } else if (this.EventName === NodeEvent[NodeEvent.FileDeleted]) {
      return NodeEvent.FileDeleted;
    } else if (this.EventName === NodeEvent[NodeEvent.FileNameChanged]) {
      return NodeEvent.FileNameChanged;
    } else if (this.EventName === NodeEvent[NodeEvent.FolderDeleted]) {
      return NodeEvent.FolderDeleted;
    } else if (this.EventName === NodeEvent[NodeEvent.FileCreated]) {
      return NodeEvent.FileCreated;
    } else if (this.EventName === NodeEvent[NodeEvent.FolderNameChanged]) {
      return NodeEvent.FolderNameChanged;
    } else if (this.EventName === NodeEvent[NodeEvent.StatusChanged]) {
      return NodeEvent.StatusChanged;
    } else if (this.EventName === NodeEvent[NodeEvent.FileMoved]) {
      return NodeEvent.FileMoved;
    } else if (this.EventName === NodeEvent[NodeEvent.ImageAdded]) {
      return NodeEvent.ImageAdded;
    } else if (this.EventName === NodeEvent[NodeEvent.ExportFinished]) {
      return NodeEvent.ExportFinished;
    } else if (this.EventName === NodeEvent[NodeEvent.PermissionsChanged]) {
      return NodeEvent.PermissionsChanged;
    } else if (this.EventName === NodeEvent[NodeEvent.ProcessingFinished]) {
      return NodeEvent.ProcessingFinished;
    } else if (this.EventName === NodeEvent[NodeEvent.ProcessingStarted]) {
      return NodeEvent.ProcessingStarted;
    } else if (this.EventName === NodeEvent[NodeEvent.PropertiesPredictionFinished]) {
      return NodeEvent.PropertiesPredictionFinished;
    } else if (this.EventName === NodeEvent[NodeEvent.ModelTrainingFinished]) {
      return NodeEvent.ModelTrainingFinished;
    } else if (this.EventName === NodeEvent[NodeEvent.TrainingFailed]) {
      return NodeEvent.TrainingFailed;
    } else if (this.EventName === NodeEvent[NodeEvent.ReportGenerationFailed]) {
      return NodeEvent.ReportGenerationFailed;
    }
  }

  getStatusAsString(): string {
    if (this.EventData) {
      if (this.getNodeType() === NodeType.File && this.getNodeEvent() === NodeEvent.FileCreated) {
        return FileStatus[(<SignalREventDataFileCreated>this.EventData).fileStatus];
      } else if (this.getNodeType() === NodeType.File && this.getNodeEvent() === NodeEvent.StatusChanged) {
        return FileStatus[(<SignalREventDataStatus>this.EventData).status];
      } else if (this.getNodeType() === NodeType.Folder && this.getNodeEvent() === NodeEvent.FolderCreated) {
        return FolderStatus[(<SignalREventDataFolderCreated>this.EventData).status];
      } else if (this.getNodeType() === NodeType.Record) {
        return RecordStatus[(<SignalREventDataStatus>this.EventData).status];
      } else if (this.getNodeType() === NodeType.File && this.getNodeEvent() === NodeEvent.ExportFinished) {
        return FileStatus[(<SignalREventExportFinished>this.EventData).status];
      } else if (this.getNodeType() === NodeType.Folder && this.getNodeEvent() === NodeEvent.PermissionsChanged) {
        return FileStatus[(<SignalREventPermissionChanged>this.EventData).status];
      } else if (this.getNodeType() === NodeType.Model && this.getNodeEvent() === NodeEvent.ProcessingFinished) {
        return FolderStatus[(<SignalREventProcessingFinished>this.EventData).status];
      } else if (this.getNodeType() === NodeType.Model && this.getNodeEvent() === NodeEvent.ProcessingStarted) {
        return ModelStatus[(<SignalREventDataStatus>this.EventData).status];
      } else if (this.getNodeType() === NodeType.File && this.getNodeEvent() === NodeEvent.PropertiesPredictionFinished) {
        return ModelStatus[(<SignalREventModelTraining>this.EventData).status];
      } else if (this.getNodeType() === NodeType.Model && this.getNodeEvent() === NodeEvent.ModelTrainingFinished) {
        return ModelStatus[(<SignalREventModelTraining>this.EventData).status];
      } else if (this.getNodeType() === NodeType.Model && this.getNodeEvent() === NodeEvent.TrainingFailed) {
        return ModelStatus[(<SignalREventModelTraining>this.EventData).status];
      }
    } else {
      return '';
    }
  }

  isDeleteRemoveAction(): boolean {
    return SignalREvent.deleteMoveActions.includes(this.getNodeEvent());
  }

  isRenameAddAction(): boolean {
    return SignalREvent.renameAddActions.includes(this.getNodeEvent());
  }
}
