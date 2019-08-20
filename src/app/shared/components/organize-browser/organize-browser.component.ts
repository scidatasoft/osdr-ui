import { Component, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BrowserDataItem, BrowserOptions, NodeType, BrowserData, FileType } from './browser-types';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionMenuItemsManager } from 'app/views/organize-view/organize-view.model';
import { ToolbarButtonType } from '../organize-toolbar/organize-toolbar.model';
import { Subscription } from 'rxjs';
import { ImagesApiService } from 'app/core/services/api/images-api.service';
import { BrowserDataBaseService } from 'app/core/services/browser-services/browser-data-base.service';
import { PaginatorManagerService } from 'app/core/services/browser-services/paginator-manager.service';
import { BasePreview } from '../file-views/preview-container.model';
import { SignalrService } from 'app/core/services/signalr/signalr.service';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { NodeEvent } from 'app/shared/components/notifications/events.model';
import { AuthService } from 'app/core/services/auth/auth.service';


@Component({
  selector: 'dr-organize-browser',
  templateUrl: './organize-browser.component.html',
  styleUrls: ['./organize-browser.component.scss'],
})
export class OrganizeBrowserComponent extends BasePreview implements OnInit, OnDestroy {

  @Input() options: BrowserOptions;
  @Input() usingFor: string;
  @Input() contextMenuActionsManager: ActionMenuItemsManager = new ActionMenuItemsManager();
  @ViewChild('myContextMenu') public contextMenu: ContextMenuComponent;
  // @ViewChild('contextMenuTrigger') contextMenuTrigger: MatMenuTrigger;

  activeToolbarButtons: ToolbarButtonType[] = [
    ToolbarButtonType.tile,
    ToolbarButtonType.table,
    ToolbarButtonType.filter,
    ToolbarButtonType.wizard,
    ToolbarButtonType.search,
  ];

  nodeType = NodeType;
  currentView = 'tile';

  private selectionChangeSubscription: Subscription;
  private signalRSubscription: Subscription = null;

  getActiveButtons(): ToolbarButtonType[] {
    return this.activeToolbarButtons;
  }

  get isFileView() {
    if (
      location.pathname.toLowerCase().startsWith('/file') ||
      location.pathname.toLowerCase().startsWith('/model')
    ) {
      return true;
    } else {
      return false;
    }
  }
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private contextMenuService: ContextMenuService,
    private imagesApi: ImagesApiService,
    public dataService: BrowserDataBaseService,
    public paginator: PaginatorManagerService,
    private auth: AuthService,
    private signalr: SignalrService) {
    super();
  }

  ngOnInit() {
    this.currentView = localStorage.getItem('currentBrowserViewFor:' + this.usingFor) || 'tile'; // || 'tile';

    this.signalRSubscription = this.signalr.organizeUpdate.subscribe((x) => {
      if (x.getNodeEvent() === NodeEvent.FileDeleted) {
        if (this.dataService.data.items.length === 0 && this.paginator.paging.pagesCount > 1) {
          this.onPaginatorClick(this.paginator.paging.pagesCount - 1, this.paginator.paging.itemsPerPage);
        } else if (this.dataService.data.items.length === 0 && this.paginator.paging.pagesCount === 1) {
          this.dataService.refreshData();
        }
      }
    });

    // Subscription to selection change
    if (!this.selectionChangeSubscription) {
      this.selectionChangeSubscription = this.dataService.selectionChangeEvents.subscribe(
        (selectedItems) => {
          selectedItems.forEach(item => {
            if (item.ownedBy === this.auth.user.profile.sub) {
              item.authorizedOwner = true;
            } else {
              item.authorizedOwner = false;
            }
          });
          this.contextMenuActionsManager.selectedItem = selectedItems;
        },
      );
    }
  }

  ngOnDestroy(): void {
    // this.pageChangeSub.unsubscribe();
    if (!this.selectionChangeSubscription) {
      this.selectionChangeSubscription.unsubscribe();
    }
    if (!this.signalRSubscription) {
      this.signalRSubscription.unsubscribe();
    }
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    if (!this.dataService.isItemSelected(item)) {
      this.dataService.clearSelection();
      this.dataService.addItemToSelections(item);
    }

    setTimeout(() => {
      this.contextMenuService.show.next({
        // Optional - if unspecified, all context menu components will open
        contextMenu: this.contextMenu,
        event: <any>$event,
        item: item,
      });
    }, 3);

    $event.preventDefault();
    $event.stopPropagation();
  }

  // TODO move it to separate service
  onPaginatorClick(pageNumber, pageSize) {
    this.paginator.moveToPage(pageNumber, pageSize);

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: { pageNumber: this.paginator.paging.current, pageSize },
      queryParamsHandling: 'merge',
    });
  }

  getPreviewImg(item) {
    const fileType = item.name.split('.').pop().toLowerCase();
    if (item.isFolder()) {
      return '/img/svg/tile/folder.svg';
    } else {
      if (item.images && item.images.length) {

        for (const i of item.images) {
          if (i.scale === 'Vector' || i.scale === 'Small') {
            return this.imagesApi.getImageUrlNew(i, item);
          }
        }
        return this.imagesApi.getImageUrlNew(item.images[0], item);
      } else {
        const knownTypes = ' .pdf .xls .xlsx .doc .docx .ppt .pptx' +
          ' .zip .rar .7z .arj .wav .l.p3 .ogg .aac .wma .ape .flac' +
          ' .tif .tiff .gif .jpeg .jpg .jif .jfif .jp2 .jpx .j2k .fpx .pcd .png .bmp' +
          ' .mpg .mpeg .mp4 .txt .rtf .csv .tsv .xml .html .htm' +
          ' .mol .sdf .cdx .rxn .rdf .jdx .dx .cif .nd2 .lsm .ims .lif .czi';
        if (knownTypes.indexOf(' .' + fileType) < 0) {
          return item.type === 'Record' ? '/img/svg/file-types/record.svg' : '/img/svg/tile/file.svg';
        } else if (fileType) {
          if (('.nd2 .lsm .ims .lif .czi').indexOf(' .' + fileType) > 0) {
            return `/img/svg/microscopy.svg`;
          }
          return `/img/svg/file-types/${fileType}.svg`;
        } else {
          return 'img/svg/tile/file.svg';
        }
      }
    }
  }

  toolBarEvent(button: ToolbarButtonType) {
    if (button === ToolbarButtonType.tile) {
      this.currentView = 'tile';
    } else if (button === ToolbarButtonType.table) {
      this.currentView = 'table';
    }
    localStorage.setItem('currentBrowserViewFor:' + this.usingFor, this.currentView);
  }

  onItemDblClick(event: MouseEvent, item: BrowserDataItem) {
    this.dataService.sendBrowserEvent({ event, item });
  }

  onItemClick(event: MouseEvent, item: BrowserDataItem) {

    // Items select
    if (event.metaKey || event.ctrlKey) {
      if (this.dataService.isItemSelected(item)) {
        this.dataService.removeItemFromSelections(item);
      } else {
        this.dataService.addItemToSelections(item);
      }
    } else if (event.shiftKey) {
      if (this.dataService.getSelectedItems().length > 0) {
        const firstItem = this.dataService.getSelectedItems()[0];
        const lastItem = this.dataService.getSelectedItems()[this.dataService.getSelectedItems().length - 1];
        const currentItemIndex = this.dataService.data.items.indexOf(item);
        const firstSelectedItemIndex = this.dataService.data.items.indexOf(firstItem);
        const lastSelectedItemIndex = this.dataService.data.items.indexOf(lastItem);

        let min = -1;
        let max = -1;

        if (currentItemIndex > lastSelectedItemIndex) {
          min = lastSelectedItemIndex;
          max = currentItemIndex;
        } else if (currentItemIndex < firstSelectedItemIndex) {
          min = currentItemIndex;
          max = firstSelectedItemIndex;
        } else {
          min = 0;
          max = -1;
        }

        const itemsList: BrowserDataItem[] = [];

        for (let i = min; i <= max; i++) {
          itemsList.push(this.dataService.data.items[i]);
        }

        for (const ii of itemsList) {
          this.dataService.addItemToSelections(ii);
        }
      }
    } else {
      if (!this.dataService.isItemSelected(item) ||
        (this.dataService.isItemSelected(item) && this.dataService.getSelectedItems().length > 1)
      ) {
        this.dataService.clearSelection();
        this.dataService.addItemToSelections(item);
      } else {
        this.dataService.clearSelection();
      }
    }
    this.dataService.sendBrowserEvent({ event, item });
  }

  selectSingleItem(event: MouseEvent, item: BrowserDataItem) {
    this.dataService.clearSelection();
    this.dataService.addItemToSelections(item);

    this.onItemClick(event, item);
  }
}
