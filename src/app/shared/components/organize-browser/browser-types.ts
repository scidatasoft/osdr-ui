import { EntitiesApiService } from 'app/core/services/api/entities-api.service';
import { FoldersApiService } from 'app/core/services/api/folders-api.service';
import { Observable, Subject } from 'rxjs';

export enum NodeType {
  User,
  Folder,
  File, // SubType
  Record, // RecordType
  Report,
  Model,
}

export enum RecordType {
  Structure,
  Spectrum,
  Reaction,
  Crystal,
}

// file type
export enum SubType {
  Generic,
  Office,
  Model,
  Records,
  Tabular,
  Pdf,
  WebPage,
  RecordsWebPage,
  Image,
  Microscopy,
}

export enum FileType {
  pdf,
  image,
  csv,
  other,
  office,
  spectra,
  crystal,
  model,
  webpage,
  microscopy,
}

export abstract class BrowserOptions {
  data: BrowserData;
  breadcrumbs: { text: string; link?: string }[];
  updateSubject: Subject<any> = new Subject();
  update: Observable<any> = this.updateSubject.asObservable();
  preventInitRefresh = false;
  constructor(public foldersApi: FoldersApiService, public entitiesApi: EntitiesApiService) {}

  abstract itemDbClick(event: MouseEvent, item: any): void;

  abstract itemClick(event: MouseEvent, item: any): void;

  abstract getItems(pageNumber: number, itemsOnPage: number): Observable<BrowserData>;

  getOptions(): BrowserOptions {
    return this;
  }

  createFolderAction(folderName: string, parent: any) {
    this.foldersApi.createFolder(folderName, parent);
  }

  deleteFolderAction(folder: any) {
    this.foldersApi.deleteFolder(folder);
  }

  moveFolderAction(folder: any, toFolder: any) {
    this.foldersApi.moveFolder(folder, toFolder);
  }

  renameFolderAction(folder: any, newName: string) {
    this.entitiesApi.renameEntity(folder, newName);
  }

  getItem(Id: string): Observable<BrowserDataItem> {
    return null;
  }
}

export class BrowserData {
  items: BrowserDataItem[];
  count: number;
  skip: number;
  take: number;
  params: any;

  constructor() {
    this.count = 0;
    this.items = [];
  }
}

export class UserPublicInformation {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export class BrowserDataItem {
  id: string;
  name = '';
  type: string;
  createdDateTime: string;
  version: number;
  link: string;
  status: string;
  images: ImageInfo[];
  totalRecords: number;
  subType: string;
  blob: { id: string; bucket: string };
  pdf: { blobId: string; bucket: string };
  ownedBy: string;
  parentId: string;
  userInfo: Observable<UserPublicInformation> = null;
  recordName: Observable<string> = null;
  accessPermissions: { groups: any[]; id: string; isPublic: boolean; users: any[] };
  authorizedOwner: boolean;

  get loading(): boolean {
    return ['Training', 'Parsing', 'Processing'].indexOf(this.status) >= 0;
  }

  get hasPreview(): boolean {
    return this.images && this.images.length > 0;
  }

  constructor(parameter?: BrowserDataItem) {
    if (parameter) {
      Object.assign(this, parameter);
    }
  }

  getNodeType(): NodeType {
    if (this.type === NodeType[NodeType.Folder]) {
      return NodeType.Folder;
    } else if (this.type === NodeType[NodeType.File]) {
      return NodeType.File;
    } else if (this.type === NodeType[NodeType.Record]) {
      return NodeType.Record;
    } else if (this.type === NodeType[NodeType.Report]) {
      return NodeType.Report;
    } else if (this.type === NodeType[NodeType.User]) {
      return NodeType.User;
    } else if (this.type === NodeType[NodeType.Model]) {
      return NodeType.Model;
    } else {
      return null;
    }
  }

  isFolder() {
    return this.getNodeType() === NodeType.Folder;
  }

  getFileExtension(): string {
    if (!this.isFolder() && this.name.indexOf('.') >= 0) {
      return this.name.split('.')[this.name.split('.').length - 1].toLowerCase();
    }
    return '';
  }

  getFileNameWithoutExtension(): string {
    if (!this.isFolder()) {
      if (this.name.indexOf('.') >= 0) {
        const ext = this.name.split('.')[this.name.split('.').length - 1].toLowerCase();
        const indexExt = this.name.indexOf('.' + ext);
        return this.name.slice(0, indexExt);
      } else {
        return this.name;
      }
    }
    return this.name;
  }

  Created() {
    return this.createdDateTime && this.convertStringToDate(this.createdDateTime);
  }

  getShortFileName(len: number = 15) {
    if (this.name.length > len) {
      return `${this.name.slice(0, len)} ... .${this.getFileExtension()}`;
    } else {
      return this.name;
    }
  }

  getSubType(): SubType {
    if (this.subType === SubType[SubType.Pdf]) {
      return SubType.Pdf;
    } else if (this.subType === SubType[SubType.Generic]) {
      return SubType.Generic;
    } else if (this.subType === SubType[SubType.Model]) {
      return SubType.Model;
    } else if (this.subType === SubType[SubType.Office]) {
      return SubType.Office;
    } else if (this.subType === SubType[SubType.Records]) {
      return SubType.Records;
    } else if (this.subType === SubType[SubType.Tabular]) {
      return SubType.Tabular;
    } else if (this.subType === SubType[SubType.WebPage]) {
      return SubType.WebPage;
    } else if (this.subType === SubType[SubType.Image]) {
      return SubType.Image;
    } else if (this.subType === SubType[SubType.Microscopy]) {
      return SubType.Microscopy;
    }
  }

  fileType(): FileType {
    if (this.getSubType() === SubType.Pdf) {
      return FileType.pdf;
    } else if (this.getSubType() === SubType.Model) {
      return FileType.model;
    } else if (this.getSubType() === SubType.WebPage) {
      return FileType.webpage;
    } else if (this.getSubType() === SubType.Tabular) {
      return FileType.csv;
    } else if (this.getSubType() === SubType.Office) {
      return FileType.office;
    } else if (this.getSubType() === SubType.Image) {
      return FileType.image;
    } else if (this.getSubType() === SubType.Records) {
      if (this.getFileExtension() === 'jdx' || this.getFileExtension() === 'dx') {
        return FileType.spectra;
      } else if (this.getFileExtension() === 'cif') {
        return FileType.crystal;
      } else {
        return FileType.other;
      }
    } else if (this.getSubType() === SubType.Microscopy) {
      return FileType.microscopy;
    }
    // if (this.getFileExtension() === 'pdf') {
    //   return FileType.pdf;
    // } else if (this.getFileExtension() === 'csv') {
    //   return FileType.csv;
    // } else if (this.getFileExtension() === 'jpg' || this.getFileExtension() === 'png') {
    //   return FileType.image;
    // } else if (this.getFileExtension() === 'doc' || this.getFileExtension() === 'docx' || this.getFileExtension() === 'xls'
    //   || this.getFileExtension() === 'xlsx' || this.getFileExtension() === 'pptx') {
    //   return FileType.office;
    // } else if (this.getFileExtension() === 'jdx' || this.getFileExtension() === 'dx') {
    //   return FileType.spectra;
    // } else if (this.getFileExtension() === 'cif') {
    //   return FileType.crystal;
    // }else {
    //   return FileType.other;
    // }
  }

  private convertStringToDate(stringDate: string) {
    return new Date(stringDate);
  }
}

export class ImageInfo {
  id: string;
  height: number;
  width: number;
  mimeType: string;
  scale: string;

  constructor(imageObj?: { id: string; height: number; width: number; mimeType: string; scale: string }) {
    if (imageObj) {
      this.id = imageObj.id;
      this.height = imageObj.height;
      this.width = imageObj.width;
      this.mimeType = imageObj.mimeType;
      this.scale = imageObj.scale;
    }
  }
}

export interface MultiItemSelection<T> {
  selectedItems: T[];

  addItemToSelections(item: T);

  removeItemFromSelections(item: T);

  clearSelection();

  getSelectedItems(): T[];

  isItemSelected(item: T): boolean;
}

export interface IModalState {
  visible: boolean;
  isVisible(): boolean;
}
