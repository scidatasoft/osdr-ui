import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FoldersApiService } from 'app/core/services/api/folders-api.service';
import { NodesApiService } from 'app/core/services/api/nodes-api.service';
import { AuthService } from 'app/core/services/auth/auth.service';
import { ItemImagePreviewService } from 'app/core/services/item-preview-image-service/item-image-preview.service';
import { ValidateFolderName} from 'app/core/services/validation/validation.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

// import {
//   MachineLearningTrainComponent
// } from '../../full-screen-dialogs/machine-learning/machine-learning-train/machine-learning-train.component';
import { SignalrService } from '../../../../core/services/signalr/signalr.service';
import { SignalREvent } from '../../notifications/events.model';
import { BrowserData, BrowserDataItem, BrowserOptions } from '../../organize-browser/browser-types';

class BreadCrumbs {
  items: BrowserDataItem[] = [];

  addItem(item: BrowserDataItem) {
    if (!this.isItemExists(item)) {
      this.items.push(item);
    }
  }

  getLast(): BrowserDataItem {
    if (this.items.length === 0) {
      return null;
    }

    return this.items[this.items.length - 1];
  }

  pop(): BrowserDataItem {
    return this.items.pop();
  }

  count(): number {
    return this.items.length;
  }

  isItemExists(item: BrowserDataItem): boolean {
    let id = -1;
    for (const i in this.items) {
      if (this.items[i].id === item.id) {
        id = Number(i);
        break;
      }
    }

    return id >= 0;
  }

  putFirst(parent_item: BrowserDataItem) {
    const parentArray: BrowserDataItem[] = [];
    parentArray.push(parent_item);

    this.items = parentArray.concat(this.items);
  }
}

export enum MoveDialogType {
  FileManager,
  FolderPicker,
}

@Component({
  selector: 'dr-move-folder',
  templateUrl: './move-folder.component.html',
  styleUrls: ['./move-folder.component.scss'],
  providers: [ItemImagePreviewService],
})
export class MoveFolderComponent implements OnInit {

  subscriptions: Subscription = null;

  startFolder: BrowserDataItem = null;
  movedItems: BrowserDataItem[] = null;

  validationMessages: {}[] = null;

  selectedFolder: BrowserDataItem = null;
  data: BrowserData = new BrowserData();
  pathToRoot: BreadCrumbs = new BreadCrumbs();

  moveFolderEvent = new EventEmitter<{ toFolder: BrowserDataItem, folder: BrowserDataItem[] }>();

  options: BrowserOptions = null;
  submitButtonText = 'Submit';
  dialogType: MoveDialogType = MoveDialogType.FileManager;

  createFolderMode = false;
  viewInit = false;

  // FormGroups
  folderMoveFG: FormGroup = null;
  folderCreateFG: FormGroup = null;
  private updateSubscription: Subscription = null;
  moveFolderLoading: boolean;
  disableModalClasses: boolean;

  // kostyl
  rootFolder = null;

  constructor(
    protected foldersApi: FoldersApiService,
    protected nodesApi: NodesApiService,
    private auth: AuthService,
    private imgService: ItemImagePreviewService,
    public dialogRef: MatDialogRef<MoveFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public inheritData: any,
    private signalR: SignalrService) {
    this.folderMoveFG = new FormGroup({});
    this.folderCreateFG = this.createForm();
    this.dialogType = this.inheritData.dialogType;
    this.submitButtonText = this.inheritData.submitButtonText;
    this.startFolder = this.inheritData.startFolder;
    this.movedItems = this.inheritData.movedItems;
    this.options = this.inheritData.options;
    this.viewInit = this.inheritData.viewInit;
  }

  ngOnInit() {
    this.openDialog();
    this.subscriptions = this.signalR.organizeUpdate.subscribe((event: SignalREvent) => {
      if (event.EventName === 'FolderCreated') {
        setTimeout(() => {
          this.selectedFolder = this.data.items.filter(x => x.id === event.EventData.id)[0];
        }, 1000);
      }
    });
  }

  createForm(): FormGroup {
    return new FormGroup({
      folderName: new FormControl(null, Validators.compose([Validators.required, ValidateFolderName, Validators.maxLength(255)])),
    });
  }

  onToggleCreateMode() {
    this.createFolderMode = !this.createFolderMode;
  }

  onCancelCreateFolder() {
    this.createFolderMode = false;
    this.folderCreateFG.setValue({ folderName: '' });
    this.folderCreateFG.get('folderName').markAsUntouched();
  }

  onSubmitCreateFolder() {
    let folderItem = null;

    if (this.pathToRoot.count() === 0 && !this.rootFolder) {
      folderItem = this.startFolder;
    } else if (this.pathToRoot.count() === 0 && this.rootFolder) {
      folderItem = this.rootFolder;
    } else {
      folderItem = this.pathToRoot.getLast();
    }

    this.foldersApi.createFolder(this.folderCreateFG.value['folderName'].trim(), folderItem);
    this.folderCreateFG.setValue({ folderName: '' });
    this.createFolderMode = false;
  }

  selectRecentlyCreatedFolder(): void {
    this.onItemClick(new MouseEvent('click'), this.data.items.filter(x => x.isFolder())[this.data.items.length - 1]);
  }

  getRootItemName(): string {
    if (this.pathToRoot.count() !== 0) {
      return this.pathToRoot.getLast().name;
    }
    return 'DRAFTS';
  }

  initFolderList(targetFolder: BrowserDataItem) {

    if (targetFolder == null || !targetFolder.id) {
      const rootItem = new BrowserDataItem();
      rootItem.id = this.auth.user.profile.sub;

      this.selectedFolder = rootItem;
    } else {
      this.selectedFolder = new BrowserDataItem(targetFolder);
    }

    let folderId = '';
    if (targetFolder && targetFolder.id) {
      folderId = targetFolder.id;
    }

    this.moveFolderLoading = true;
    this.foldersApi.getFolderContentById(folderId).subscribe(
      (data: { id: string, parentId: string, contentItems: BrowserDataItem[] }) => {

        const parentArray: BrowserDataItem[] = [];

        if (data.parentId != null && this.pathToRoot.count() === 1) {
          const parent_item = new BrowserDataItem();
          parent_item.id = data.parentId;
          this.pathToRoot.putFirst(parent_item);
        }

        for (const i of data.contentItems) {
          parentArray.push(new BrowserDataItem(i));
        }

        this.data.items = parentArray;
        this.moveFolderLoading = false;
      },
    );
  }

  openDialog() {
    this.data.items = [];
    this.createFolderMode = false;
    this.selectedFolder = null;
    // this.modalRef = this.modalService.show(this.moveFolderModal);

    this.nodesApi.getNode({ id: { id: this.startFolder.id } }).pipe(
      map(
        (x) => {
          return {
            breadcrumbs: JSON.parse(x.headers.get('x-breadcrumbs')) as { Id: string, Name: string }[],
            item: new BrowserDataItem(x.body as BrowserDataItem),
          };
        },
      )).subscribe(
        (breadCrumbsResponse: { breadcrumbs: { Id: string, Name: string }[], item: BrowserDataItem }) => {
          for (let i = breadCrumbsResponse.breadcrumbs.length - 1; i >= 0; i--) {
            if (breadCrumbsResponse.breadcrumbs[i].Name) {
              const newItem = new BrowserDataItem();
              newItem.id = breadCrumbsResponse.breadcrumbs[i].Id;
              newItem.name = breadCrumbsResponse.breadcrumbs[i].Name;
              this.pathToRoot.addItem(newItem);
            }
          }

          if (this.startFolder && this.startFolder.id && this.startFolder.id !== this.auth.user.profile.sub) {
            this.pathToRoot.addItem(new BrowserDataItem(this.startFolder));
          }

          this.initFolderList(this.startFolder);

          this.createFolderMode = false;
          this.folderCreateFG.setValue({ folderName: '' });
          this.folderCreateFG.get('folderName').markAsUntouched();
        },
      );

    this.updateSubscription = this.options.update.subscribe(x => this.refreshData(x));
  }

  public unsubscribe() {
    this.updateSubscription.unsubscribe();
    this.data.items = [];
    this.pathToRoot.items = [];
  }

  onSubmit() {
    this.nodesApi.setCurrentNodeWithoutBreadCrumbs(this.startFolder.id).subscribe(
      (item) => {
        this.moveFolderEvent.emit({ toFolder: this.selectedFolder, folder: this.movedItems });

        this.updateSubscription.unsubscribe();
        this.data.items = [];
      },
    );
  }

  onHideDialog() {
    this.nodesApi.setCurrentNodeWithoutBreadCrumbs(this.startFolder.id).subscribe(
      (item) => {
        this.updateSubscription.unsubscribe();
        this.data.items = [];
        this.dialogRef.close();
      },
    );
  }

  isItemInMovedFolders(item: BrowserDataItem): boolean {
    if (!item.isFolder()) {
      return true;
    }

    for (const i of this.movedItems) {
      if (item.id === i.id) {
        return true;
      }
    }
    return false;
  }

  onItemClick(event, item) {
    if (!this.isItemInMovedFolders(item)) {
      if (this.selectedFolder !== item) {
        this.selectedFolder = item;
      } else {
        this.selectedFolder = this.startFolder;
      }
    }
  }

  onItemDbClick(event, item) {
    if (this.isItemInMovedFolders(item)) {
      return;
    }

    this.nodesApi.setCurrentNodeWithoutBreadCrumbs(item.id).subscribe(
      (response) => {
        this.data.items = [];

        this.pathToRoot.addItem(new BrowserDataItem(item));
        this.initFolderList(this.pathToRoot.getLast());
      },
    );
  }

  onMoveBack() {
    if (this.pathToRoot.count() === 0) {
      return;
    }

    this.pathToRoot.pop();
    this.nodesApi.setCurrentNodeWithoutBreadCrumbs(this.pathToRoot.getLast().id).subscribe(
      (responce) => {
        // console.log(responce);
        this.rootFolder = responce;

        this.data.items = [];
        if (this.pathToRoot.getLast() != null && !this.pathToRoot.getLast().name) {
          if (this.pathToRoot.getLast().id === this.auth.user.profile.sub) {
            this.pathToRoot.pop();
            this.initFolderList(null);
            return;
          }
        } else {
          this.initFolderList(this.pathToRoot.getLast());
        }
      },
    );
  }

  canMoveToFolder(): boolean {
    if (!this.startFolder || !this.selectedFolder) {
      return true;
    }

    if (this.dialogType !== 1) {
      if ((this.pathToRoot.getLast() && this.pathToRoot.getLast().id === this.startFolder.id &&
        this.pathToRoot.getLast().id === this.selectedFolder.id) ||
        (this.pathToRoot.getLast() === null && this.startFolder.id === this.auth.user.profile.sub &&
          this.selectedFolder.id === this.startFolder.id) || (this.selectedFolder.id === this.startFolder.id)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getPreviewImg(item) {
    return this.imgService.getPreviewImg(item);
  }

  isFolderPicker() {
    if (this.dialogType === 1) {
      return true;
    } else {
      return false;
    }
  }

  private refreshData(x: any) {
    this.initFolderList(this.pathToRoot.getLast());
  }
}
