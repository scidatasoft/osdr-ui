import { Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { ToolbarButtonType } from './organize-toolbar.model';
import { ActionMenuItemsManager } from 'app/views/organize-view/organize-view.model';
import { Router } from '@angular/router';
import { FullTextSearchService } from 'app/core/services/search/full-text-search.service';
import { BrowserDataBaseService } from 'app/core/services/browser-services/browser-data-base.service';
import { BrowserViewState } from 'app/core/services/browser-services/browser-data-base.service';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';



@Component({
  selector: 'dr-organize-toolbar',
  templateUrl: './organize-toolbar.component.html',
  styleUrls: ['./organize-toolbar.component.scss'],
  providers: [FullTextSearchService],
})
export class OrganizeToolbarComponent implements OnInit {
  @Input() isPublic = false;
  @Input() fileInfo: any;

  public buttonType = ToolbarButtonType;
  @Input() breadcrumbs: any[] = [];
  @Input() currentView: string;
  @Output() toolbarEvent = new EventEmitter<ToolbarButtonType>();
  @Output() toolbarExportEvent: EventEmitter<string> = new EventEmitter<string>();
  @Input() contextMenuActionsManager: ActionMenuItemsManager = new ActionMenuItemsManager();

  @ViewChild('fileContextMenu', { static: true }) public fileContextMenu: ContextMenuComponent;
  @ViewChild('searchBox', { static: true }) searchBox: ElementRef;

  @Input() activeButtons: ToolbarButtonType[] = [];

  showSearchInput = false;

  constructor(private contextMenuService: ContextMenuService,
    private searchService: FullTextSearchService,
    private router: Router,
    @Optional() private dataService: BrowserDataBaseService) {
  }

  ngOnInit() {
  }

  isButtonActive(button: ToolbarButtonType): boolean {
    for (const i in this.activeButtons) {
      if (button === this.activeButtons[i]) {
        return true;
      }
    }

    return false;
  }

  public onFileFolderContextMenu($event: MouseEvent, item: any): void {
    item = item || this.dataService.selectedItems[0];
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.fileContextMenu,
      event: $event,
      item: item,
    });
    $event.preventDefault();
    $event.stopPropagation();
  }

  public onToolbarExportClick(fileType: string): void {
    this.toolbarExportEvent.emit(fileType);
  }

  onToolbarButtonClick(button_type: ToolbarButtonType) {
    // this.currentView = button_type;
    this.toolbarEvent.emit(button_type);
  }

  onSearchClick() {
    this.showSearchInput = !this.showSearchInput;
    if (this.showSearchInput) {
      setTimeout(() => {
        this.searchBox.nativeElement.focus();
      }, 1000);
    } else {
      this.searchBox.nativeElement.value = '';
    }
  }

  getSearchTooltip(): string {
    if (this.showSearchInput) {
      return 'Clear Search';
    } else {
      return 'Search';
    }
  }

  onKeyUpSearchBox(event, searchString) {
    event.preventDefault();
    event.stopPropagation();

    if (event.keyCode === 27) {
      this.searchService.doSearch(null);
    } else {
      this.searchService.doSearch(searchString);
    }
  }

  onItemClick(item) {
    this.searchBox.nativeElement.value = '';
    this.showSearchInput = false;
    if (item.link) {
      this.router.navigateByUrl(item.link);
    } else {
      if (this.dataService) {
        this.dataService.searchData = this.searchService.searchString;
        this.dataService.setBrowserState(BrowserViewState.searchResultBrowser);
      }
    }
  }
}
