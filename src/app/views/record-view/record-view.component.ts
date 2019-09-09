import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EntitiesApiService } from 'app/core/services/api/entities-api.service';
import { ImagesApiService } from 'app/core/services/api/images-api.service';
import { MetadataApiService } from 'app/core/services/api/metadata-api.service';
import { NodesApiService } from 'app/core/services/api/nodes-api.service';
import { UsersApiService } from 'app/core/services/api/users-api.service';
import { PaginatorManagerService } from 'app/core/services/browser-services/paginator-manager.service';
import { PageTitleService } from 'app/core/services/page-title/page-title.service';
import { BrowserDataItem } from 'app/shared/components/organize-browser/browser-types';
import { PropertiesEditorComponent } from 'app/shared/components/properties-editor/properties-editor.component';
import { PropertiesInfoBoxComponent } from 'app/shared/components/properties-info-box/properties-info-box.component';
import { SharedLinksComponent } from 'app/shared/components/shared-links/shared-links.component';
import { SidebarContentService } from 'app/shared/components/sidebar-content/sidebar-content.service';
import { map } from 'rxjs/operators';
import { isArray } from 'util';

import { SignalrService } from '../../core/services/signalr/signalr.service';

@Component({
  selector: 'dr-record-view',
  templateUrl: './record-view.component.html',
  styleUrls: ['./record-view.component.scss'],
  providers: [PaginatorManagerService],
})
export class RecordViewComponent implements OnInit {
  breadcrumbs = [{ text: 'DRAFTS', link: '/organize/drafts' }, { text: 'File sdfsf sdf sd' }];
  listProperties = [];

  @ViewChildren('propertiesInfoBox') propertiesInfoBoxComponents: QueryList<PropertiesInfoBoxComponent>;
  @ViewChild('infoBoxContainer', { static: false }) infoBoxContainer;
  @ViewChild('fileViewContainer', { read: ViewContainerRef, static: false }) fileViewContainer: ViewContainerRef;
  record: BrowserDataItem;
  toolBarButtons = [];
  infoBoxes: Object[] = [];

  @ViewChild('fileNameInput', { static: false }) fileNameInput: ElementRef;
  @ViewChild('copyFilenameTooltip', { static: false }) copyFilenameTooltip: ElementRef;
  copyFilenameText: string;

  JSMolPreview = false;
  JsSpectraPreview = false;

  currentTab = 'properties';
  lastShownPopoverName: string;
  lastShownPopoverTimeoutId: any;

  lastSelectedInfoBoxName: string;

  isPublic: boolean;
  isPublicParent: boolean;
  isShared: boolean;

  currentFileViewComponent = null;
  currentFileViewContainerInstance;

  constructor(
    private nodesApi: NodesApiService,
    private entitiesApi: EntitiesApiService,
    private imagesApi: ImagesApiService,
    private medatadataApi: MetadataApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public sidebarContent: SidebarContentService,
    private pageTitle: PageTitleService,
    private signalr: SignalrService,
    private usersApi: UsersApiService,

  ) {
    this.breadcrumbs = [{ text: 'DRAFTS' }];
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data: { share: boolean; shareParent: boolean }) => {
      this.isPublic = data.share;
      this.isPublicParent = data.shareParent;
      this.updateRecord();
    });
    this.subscribeToSignalr();
  }

  updateRecord() {
    const recordId = this.activatedRoute.snapshot.params['id'];

    this.nodesApi
      .getNode(recordId)
      .pipe(
        map(x => {
          const breadcrumbs = JSON.parse(x.headers.get('x-breadcrumbs')) as { Id: string; Name: string }[];
          breadcrumbs.forEach(element => {
            if (element.Name) {
              element.Name = decodeURIComponent(element.Name);
            }
          });
          const item = new BrowserDataItem(x.body as BrowserDataItem);
          item.userInfo = this.usersApi.getUserInfo(item.ownedBy);

          return {
            breadcrumbs: breadcrumbs,
            item: item,
          };
        }),
      )
      .subscribe((breadCrumbsResponse: { breadcrumbs: { Id: string; Name: string }[]; item: BrowserDataItem }) => {
        this.record = breadCrumbsResponse.item;
        const fileName = breadCrumbsResponse.breadcrumbs.slice(-2)[0].Name;
        this.pageTitle.title = `${fileName} / ${this.record.name}`;

        this.setBreadCrumbs(breadCrumbsResponse);
        const shortFileInfo = breadCrumbsResponse.breadcrumbs[0];
        const fileType = shortFileInfo.Name.slice(-3).toLowerCase();

        this.getSharedStatus();
        this.updateProperties(recordId);
      });
  }

  getSharedStatus() {
    if (this.record && this.record.accessPermissions) {
      return (this.isShared = this.record.accessPermissions.isPublic);
    } else {
      return (this.isShared = false);
    }
  }

  subscribeToSignalr() {
    this.signalr.organizeUpdate.subscribe(x => {
      if (x.EventName === 'PermissionsChanged') {
        // this.isShared = x.EventData.permissionPublic;
        this.updateRecord();
      }
    });
  }

  updateProperties(recordId) {
    this.entitiesApi.getEntitiesProperties(recordId, 'records').subscribe(data => {
      let issues;
      if (data.properties) {
        issues = { name: 'issues', img: 'intrinsic.ico', properties: data.properties['issues'] };
        delete data.properties['issues'];
      }

      this.listProperties = [];
      if (data.properties) {
        for (const i in data.properties) {
          if (data.properties[i] && Array.isArray(data.properties[i]) && data.properties[i].length > 0) {
            this.infoBoxes.push(data.properties[i]);
            this.listProperties.push({ name: i, img: 'intrinsic.ico', properties: data.properties[i] });
          }
        }
      }
      if (issues && this.record && this.record.subType === 'Structure') {
        this.infoBoxes.push(issues.properties);
        this.listProperties.push(issues);
      }
      this.getPropertiesMeta(this.listProperties);
    });
  }

  getPropertiesMeta(properties) {
    if (this.isPublicParent) {
      for (const item of properties) {
        const name = item.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        if (name === 'issues' || name === 'fields') {
          continue;
        }
        this.medatadataApi.getPropertiesMeta(name, (this.record as any).parentId).subscribe(x => {
          for (const screenPart of x.screens[0].screenParts) {
            screenPart.responseKey = screenPart.responseTarget.match(/@Name='(.*)'/)[1];
          }
          item.meta = x;
        });
      }
    }
  }

  setBreadCrumbs(fileInfoData: { breadcrumbs: { Id: string; Name: string }[]; item: BrowserDataItem }) {
    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'];

      if (fileInfoData.item.id === id) {
        this.generateBreadCrumbs(fileInfoData);
      }
    });
  }

  generateBreadCrumbs(fileInfoData: { breadcrumbs: { Id: string; Name: string }[]; item: BrowserDataItem }) {
    let breadcrumbs = [{ text: 'DRAFTS', link: '/organize/drafts' }];
    for (let i = fileInfoData.breadcrumbs.length - 1; i >= 0; i--) {
      if (fileInfoData.breadcrumbs[i].Name && i !== 0) {
        breadcrumbs.push({
          text: fileInfoData.breadcrumbs[i].Name,
          link: `/organize/${fileInfoData.breadcrumbs[i].Id}`,
        });
      }
    }

    // link to file record ovner
    breadcrumbs.push({
      text: fileInfoData.breadcrumbs[0].Name,
      link: `/file/${fileInfoData.breadcrumbs[0].Id}`,
    });

    // linnk to record link
    breadcrumbs.push({ text: this.record.id, link: '' });

    if (this.isPublic && this.isPublicParent) {
      breadcrumbs = breadcrumbs.slice(breadcrumbs.length - 2, breadcrumbs.length);
    } else if (this.isPublic && !this.isPublicParent) {
      breadcrumbs = breadcrumbs.slice(breadcrumbs.length - 1, breadcrumbs.length);
    }
    this.breadcrumbs = breadcrumbs;
  }

  goToPreviewPage() {
    this.router.navigate(['preview'], { relativeTo: this.activatedRoute });
  }

  getImageURL(item): string {
    if (item && item.images) {
      for (const i of item.images) {
        if (i.scale === 'Vector' || i.scale === 'Medium') {
          return this.imagesApi.getImageUrlNew(i, item);
        }
      }
    } else {
      return `/img/svg/file-types/record.svg`;
    }
  }

  goToAssignInfoBox(item: { name: string }, index: string | number) {
    this.lastSelectedInfoBoxName = item.name;
    this.currentTab = 'properties';
    setTimeout(() => {
      this.propertiesInfoBoxComponents.toArray()[index].expand();
      const infoBoxContainer = this.infoBoxContainer.nativeElement as HTMLElement;
      const infoBoxHeader = infoBoxContainer.querySelector(`[name=${item.name}]`) as HTMLElement;
      infoBoxContainer.scrollTo(0, infoBoxHeader.offsetTop - 50);
    });
  }

  copyFilename() {
    this.fileNameInput.nativeElement.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.copyFilenameText = 'Copied!';
        (this.copyFilenameTooltip as any).show();
      }
    } catch (err) { }
  }

  openPropertiesEditorDialog(data) {
    data.record = this.record;
    const dialogRef = this.dialog.open(PropertiesEditorComponent, {
      width: '800px',
      data: data,
    });
    dialogRef.componentInstance.save.subscribe(x => {
      this.updateRecord();
    });
  }

  openSharedLinksDialog(): void {
    const dialogRef = this.dialog.open(SharedLinksComponent, {
      width: '650px',
      data: { fileInfo: this.record },
    });
  }

  showPopover(popoverName) {
    if (this.lastShownPopoverName === popoverName && this.lastShownPopoverTimeoutId) {
      clearTimeout(this.lastShownPopoverTimeoutId);
      this.lastShownPopoverTimeoutId = null;
    }
    this[this.lastShownPopoverName] = false;
    this.lastShownPopoverName = popoverName;
    this[popoverName] = true;
  }

  hidePopover(popoverName) {
    if (this.lastShownPopoverTimeoutId) {
      clearTimeout(this.lastShownPopoverTimeoutId);
      this.lastShownPopoverTimeoutId = null;
    }

    this.lastShownPopoverTimeoutId = setTimeout(() => {
      this[popoverName] = false;
    }, 500);
  }
}
