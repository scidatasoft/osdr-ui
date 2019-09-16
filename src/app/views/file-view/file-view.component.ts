import {
  AfterContentInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  Type,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';

import { BlobsApiService } from '../../core/services/api/blobs-api.service';
import { EntitiesApiService } from '../../core/services/api/entities-api.service';
import { FoldersApiService } from '../../core/services/api/folders-api.service';
import { ImagesApiService } from '../../core/services/api/images-api.service';
import { BrowserDataBaseService } from '../../core/services/browser-services/browser-data-base.service';
import { IBrowserEvent } from '../../core/services/browser-services/browser-data.service';
import { PaginatorManagerService } from '../../core/services/browser-services/paginator-manager.service';
import { PageTitleService } from '../../core/services/page-title/page-title.service';
import { SignalrService } from '../../core/services/signalr/signalr.service';
import { ExportDialogComponent } from '../../shared/components/export-dialog/export-dialog.component';
import { CifPreviewComponent } from '../../shared/components/file-views/cif-preview/cif-preview.component';
import { CSVPreviewComponent } from '../../shared/components/file-views/csv-preview/csv-preview.component';
import { IFilePreviewComponent } from '../../shared/components/file-views/file-view.model';
import { ImageFileViewComponent } from '../../shared/components/file-views/image-file-view/image-file-view.component';
import { MicroscopyViewComponent } from '../../shared/components/file-views/microscopy-view/microscopy-view.component';
import { OfficePreviewComponent } from '../../shared/components/file-views/office-preview/office-preview.component';
import { PdfFileViewComponent } from '../../shared/components/file-views/pdf-file-view/pdf-file-view.component';
import { SavFileViewComponent } from '../../shared/components/file-views/sav-file-view/sav-file-view.component';
import { SpectraJsmolPreviewComponent } from '../../shared/components/file-views/spectra-jsmol-preview/spectra-jsmol-preview.component';
import { FilterField } from '../../shared/components/filter-bar/filter-bar.model';
import { GenericMetadataPreviewComponent } from '../../shared/components/generic-metadata-preview/generic-metadata-preview.component';
import { InfoBoxFactoryService } from '../../shared/components/info-box/info-box-factory.service';
import { BrowserDataItem, BrowserOptions, FileType, NodeType, SubType } from '../../shared/components/organize-browser/browser-types';
import { OrganizeBrowserComponent } from '../../shared/components/organize-browser/organize-browser.component';
import { ToolbarButtonType } from '../../shared/components/organize-toolbar/organize-toolbar.model';
import { PropertiesInfoBoxComponent } from '../../shared/components/properties-info-box/properties-info-box.component';
import { SharedLinksComponent } from '../../shared/components/shared-links/shared-links.component';
import { SidebarContentService } from '../../shared/components/sidebar-content/sidebar-content.service';
import { FileViewType } from '../../shared/models/file-view-type';

@Component({
  selector: 'dr-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss'],
  entryComponents: [
    OrganizeBrowserComponent,
    PdfFileViewComponent,
    ImageFileViewComponent,
    CSVPreviewComponent,
    OfficePreviewComponent,
    CifPreviewComponent,
    SpectraJsmolPreviewComponent,
    SavFileViewComponent,
    MicroscopyViewComponent,
    GenericMetadataPreviewComponent,
  ],
})
export class FileViewComponent extends BrowserOptions implements OnInit, AfterContentInit, OnDestroy {
  @Input() isPublic: boolean;
  @Input() isPublicParent: boolean;
  toolBarButtons = [ToolbarButtonType.tile, ToolbarButtonType.table];

  fileActions: { title: string; active: boolean; viewType: FileViewType }[] = [];
  currentFileViewComponent = null;

  infoBoxes: Object[] = [];
  tab = FileViewType;
  currentTab = FileViewType.Records;
  showFilter = false;
  filterListFields: FilterField[] = [];
  appliedFilterList: FilterField[] = [];

  fileInfo: BrowserDataItem = null;

  showRecords: boolean = undefined;
  showProperties = true;
  showImagePreview = false;
  showFullImagePreview = false;
  JSMolPreview = false;
  JsSpectraPreview = false;
  isMicroscopy = false;

  isShared = false;
  sharedToolTip: string;

  copyFilenameText: string;

  fileProcessed = false;
  initied = false;
  private browserEventSubscription: Subscription = null;

  @ViewChild('fileNameInput', { static: false }) fileNameInput: ElementRef;
  @ViewChild('copyFilenameTooltip', { static: false }) copyFilenameTooltip: ElementRef;
  @ViewChild('fileViewContainer', { read: ViewContainerRef, static: true })
  fileViewContainer: ViewContainerRef;

  @ViewChildren('propertiesInfoBox') propertiesInfoBoxComponents: QueryList<PropertiesInfoBoxComponent>;
  @ViewChild('infoBoxContainer', { static: false }) infoBoxContainer: any;

  private signalRSubscription: Subscription = null;
  private routeEventsSubscription: Subscription;
  lastShownPopoverName: string;
  lastShownPopoverTimeoutId: any;
  lastSelectedInfoBoxName: string;

  get fileType(): string {
    return this.fileInfo.name
      .split('.')
      .pop()
      .toLowerCase();
  }

  get currentView() {
    return localStorage.getItem('currentBrowserViewFor:records-view') || 'tile';
  }

  get fileExtension() {
    return (
      this.fileInfo &&
      this.fileInfo.name
        .split('.')
        .pop()
        .toLowerCase()
    );
  }

  get recordsType() {
    if (!this.dataService.data || !this.dataService.data.items || !this.dataService.data.items.length) {
      return null;
    }
    return this.dataService.data.items[0].subType;
  }

  currentFileViewContainerInstance;

  constructor(
    public foldersApi: FoldersApiService,
    public entitiesApi: EntitiesApiService,
    private imagesApi: ImagesApiService,
    private blobsApi: BlobsApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public ffService: InfoBoxFactoryService,
    private signalr: SignalrService,
    public sidebarContent: SidebarContentService,
    private dataService: BrowserDataBaseService,
    private paginator: PaginatorManagerService,
    public dialog: MatDialog,
    private componentResolver: ComponentFactoryResolver,
    private pageTitle: PageTitleService,
  ) {
    super(foldersApi, entitiesApi);
    this.breadcrumbs = [{ text: 'DRAFTS' }];

    // const properties =
    //   [
    //     { name: 'InChI', value: 'InChI=1S/C7H6O2/c8-5-6-1-3-7(9)4-2-6/h1-5,9H' },
    //     { name: 'InChIKey', value: 'RGHHSNMVTDWUBI-UHFFFAOYSA-N' },
    //     { name: 'NonStdInChI', value: 'InChI=1/C7H6O2/c8-5-6-1-3-7(9)4-2-6/h1-5,9H' },
    //     { name: 'SMILES', value: 'OC1=CC=C(C=C1)C=O' },
    //     { name: 'MF', value: 'C7 H6 O2' },
    //     { name: 'MW', value: '122.12134552002' },
    //     { name: 'MM', value: '122.036781311035' },
    //     { name: 'MAM', value: '122.036781311035' },
    //     { name: 'Tag(s)', value: 'None' },
    //   ];
    //
    // this.infoBoxes.push(this.ffService.setCommonInfoBoxComponent('Intrinsic properties', 'intrinsic.ico', properties));
    // this.infoBoxes.push(this.ffService.setCommonInfoBoxComponent('User properties', 'user.ico', properties));
  }

  ngOnInit() {
    this.dataService.subscribeToEvents();
    // added this beacause cannot provide activate route to service
    this.dataService.myActivateRouter = this.activatedRoute;

    this.activatedRoute.data.subscribe((data: { share: boolean; shareParent: boolean }) => {
      this.isPublic = data.share;
      this.isPublicParent = data.shareParent;
    });

    const file_id = this.activatedRoute.snapshot.params['id'];

    this.activatedRoute.queryParams.subscribe((queryParam: Params) => {
      if ('pageNumber' in queryParam) {
        this.paginator.paging.current = queryParam['pageNumber'];
      }

      this.paginator.initPaginator(
        'pageNumber' in queryParam ? queryParam['pageNumber'] : null,
        'pageSize' in queryParam ? queryParam['pageSize'] : null,
      );

      this.dataService.setViewParams(queryParam);
    });

    this.routeEventsSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.dataService.refreshData();
      }
    });

    this.subscribeToSignalr();

    this.dataService.setActiveNode(file_id).subscribe((x: any) => {
      this.dataService.initBreadCrumbs(file_id).subscribe(async () => {
        await this.dataService.refreshData();

        this.fileInfo = this.dataService.currentItem;
        this.isShared = this.fileInfo.accessPermissions ? this.fileInfo.accessPermissions.isPublic : false;
        this.pageTitle.title = this.fileInfo.name;
        this.initView();
        this.changeFileView(this.getFileViewComponent(this.fileInfo), this.fileInfo);

        if (this.isShared) {
          this.sharedToolTip = 'Change Sharing Settings';
        } else {
          this.sharedToolTip = 'Create Public Link';
        }

        this.fileActions = [
          {
            title: `records ${this.fileInfo.totalRecords}`,
            active: !!this.fileInfo.totalRecords,
            viewType: FileViewType.Records,
          },
          {
            title: 'Biological Information',
            active: this.isMicroscopy,
            viewType: FileViewType.Bio_Metadata,
          },
          {
            title: 'File Information',
            active: true,
            viewType: FileViewType.Generic_Metadata,
          },
        ];
      });
    });

    if (!this.browserEventSubscription) {
      this.browserEventSubscription = this.dataService.browserEvents.subscribe((eventData: IBrowserEvent) => {
        if (eventData.event.type === 'dblclick') {
          this.itemDbClick(eventData.event, eventData.item);
        } else if (eventData.event.type === 'click') {
          this.itemClick(eventData.event, eventData.item);
        }
      });
    }
  }

  subscribeToSignalr() {
    this.signalRSubscription = this.signalr.organizeUpdate.subscribe(x => {
      // if (x.EventName === 'ImageAdded') {
      //   this.fileProcessed = true;
      // }
      if (x.EventName === 'PermissionsChanged') {
        this.dataService.currentItem.accessPermissions = x.EventData;
        this.isShared = x.EventData.permissionPublic;
        if (this.isShared) {
          this.sharedToolTip = 'Change Sharing Settings';
        } else {
          this.sharedToolTip = 'Create Public Link';
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.signalRSubscription) {
      this.signalRSubscription.unsubscribe();
    }

    if (this.browserEventSubscription) {
      this.browserEventSubscription.unsubscribe();
    }

    if (this.routeEventsSubscription) {
      this.routeEventsSubscription.unsubscribe();
    }

    if (this.currentFileViewComponent) {
      this.currentFileViewComponent.destroy();
    }

    this.dataService.unSubscribe();
  }

  ngAfterContentInit(): void {
    this.initied = true;
  }

  initView() {
    if (!this.fileInfo) {
      return;
    }

    if (this.fileInfo.totalRecords && this.fileInfo.totalRecords > 0) {
      this.showRecords = true;
    }

    if (this.fileInfo.fileType() === FileType.webpage) {
      this.showImagePreview = true;
      this.currentTab = FileViewType.Preview;
    }

    if (this.fileInfo.fileType() === FileType.microscopy) {
      if (this.fileInfo.images) {
        this.currentTab = FileViewType.Preview;
      } else {
        this.currentTab = FileViewType.Generic_Metadata;
      }
      this.isMicroscopy = true;
    }

    if (this.fileInfo.fileType() === FileType.other || this.fileInfo.fileType() === FileType.image) {
      this.showImagePreview = true;
    }

    if (this.fileInfo.fileType() === FileType.crystal) {
      this.showImagePreview = false;
      this.JSMolPreview = true;
      this.JsSpectraPreview = false;
    }

    if (this.fileInfo.fileType() === FileType.spectra) {
      this.showImagePreview = false;
      this.JSMolPreview = false;
      this.JsSpectraPreview = true;
    }

    if (
      this.fileInfo.fileType() === FileType.pdf ||
      this.fileInfo.fileType() === FileType.office ||
      this.fileInfo.fileType() === FileType.csv ||
      this.fileInfo.fileType() === FileType.image
    ) {
      this.showFullImagePreview = true;
      this.currentTab = FileViewType.Preview;
    }
  }

  copyFilename() {
    this.fileNameInput.nativeElement.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.copyFilenameText = 'Copied!';
        (this.copyFilenameTooltip as any).show();
        console.log((this.copyFilenameTooltip as any).show);
      }
    } catch (err) {}
  }

  getImageURL(item: BrowserDataItem): string {
    if (item && (!item.images || !item.images.length)) {
      const fileType = item.name
        .split('.')
        .pop()
        .toLowerCase();

      const knownTypes =
        ' .pdf .xls .xlsx .doc .docx .ppt .pptx' +
        ' .zip .rar .7z .arj .wav .l.p3 .ogg .aac .wma .ape .flac' +
        ' .tif .tiff .gif .jpeg .jpg .jif .jfif .jp2 .jpx .j2k .fpx .pcd .png .bmp' +
        ' .mpg .mpeg .mp4 .txt .rtf .csv .tsv .xml .html .htm' +
        ' .mol .sdf .cdx .rxn .rdf .jdx .dx .cif .nd2 .lsm .ims .lif .czi';
      if (knownTypes.indexOf(` .${fileType}`) < 0) {
        return item.type === 'Record' ? '/img/svg/file-types/record.svg' : '/img/svg/tile/file.svg';
      } else if (fileType) {
        return `/img/svg/file-types/${fileType}.svg`;
      } else {
        return 'img/svg/tile/file.svg';
      }
    } else if (!item) {
      return null;
    }

    const image = item.images.filter((x: { scale: string }) => x.scale === 'Vector' || x.scale === 'Medium')[0];
    return this.imagesApi.getImageUrlNew(image, item);
  }

  getItems(pageNumber: any, pageSize: any) {
    return null;
  }

  itemDbClick(event: MouseEvent, item: BrowserDataItem) {
    if (!item.isFolder() && item.type === 'Record') {
      this.router.navigateByUrl(`/record/${item.id}`);
    } else {
      this.router.navigate(['/file', item.id]);
    }
  }

  itemClick(event: MouseEvent, item: BrowserDataItem) {}

  onApplyFilter(appliedFilterList: FilterField[]) {
    this.appliedFilterList = appliedFilterList;
  }

  onToolbarButtonClick(buttonTypeClick: ToolbarButtonType) {
    if (buttonTypeClick === ToolbarButtonType.tile || buttonTypeClick === ToolbarButtonType.table) {
      if (this.currentFileViewContainerInstance.toolBarEvent) {
        this.currentFileViewContainerInstance.toolBarEvent(buttonTypeClick);
      }
    } else if (buttonTypeClick === ToolbarButtonType.filter) {
      this.showFilter = !this.showFilter;
    } else if (buttonTypeClick === ToolbarButtonType.wizard) {
      const queryParams = {};
      for (const i of this.appliedFilterList) {
        queryParams[i.name] = i.value;
      }

      this.router.navigate(['data-transform'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
      });
    }
  }

  downloadEntity(): void {
    if (this.fileInfo) {
      window.open(this.blobsApi.getBlobUrl(this.fileInfo, true));
    }
  }

  openExportDialog(fileType: string): void {
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      width: '800px',
      data: {
        fileType,
        selectedItems: [this.fileInfo],
      },
    });
  }

  openSharedLinksDialog(): void {
    const dialogRef = this.dialog.open(SharedLinksComponent, {
      width: '650px',
      data: {
        fileInfo: this.dataService.currentItem,
      },
    });
  }

  showPopover(popoverName: string) {
    if (this.lastShownPopoverName === popoverName && this.lastShownPopoverTimeoutId) {
      clearTimeout(this.lastShownPopoverTimeoutId);
      this.lastShownPopoverTimeoutId = null;
    }
    this[this.lastShownPopoverName] = false;
    this.lastShownPopoverName = popoverName;
    this[popoverName] = true;
  }

  hidePopover(popoverName: string | number) {
    if (this.lastShownPopoverTimeoutId) {
      clearTimeout(this.lastShownPopoverTimeoutId);
      this.lastShownPopoverTimeoutId = null;
    }

    this.lastShownPopoverTimeoutId = setTimeout(() => {
      this[popoverName] = false;
    }, 500);
  }

  getFileViewComponent(dataItem: BrowserDataItem): Type<any> {
    if (this.currentTab === FileViewType.Preview) {
      if (dataItem.getNodeType() === NodeType.File) {
        if (dataItem.getSubType() === SubType.Image || dataItem.getSubType() === SubType.Records) {
          if (
            (this.fileInfo.getFileExtension() === 'jdx' || this.fileInfo.getFileExtension() === 'dx') &&
            environment.capabilities.spectrum
          ) {
            return SpectraJsmolPreviewComponent;
          } else if (this.fileInfo.getFileExtension() === 'cif' && environment.capabilities.crystal) {
            return CifPreviewComponent;
          } else {
            if (environment.capabilities.image) {
              return ImageFileViewComponent;
            } else {
              return null;
            }
          }
        } else if (
          (dataItem.getSubType() === SubType.Pdf || dataItem.getSubType() === SubType.WebPage) &&
          (environment.capabilities.webPage || environment.capabilities.pdf)
        ) {
          return PdfFileViewComponent;
        } else if (dataItem.getSubType() === SubType.Tabular && environment.capabilities.tabular) {
          return CSVPreviewComponent;
        } else if (dataItem.getSubType() === SubType.Office && environment.capabilities.office) {
          return OfficePreviewComponent;
        } else if (dataItem.getSubType() === SubType.Microscopy && environment.capabilities.microscopy) {
          return ImageFileViewComponent;
        }
      } else if (dataItem.getNodeType() === NodeType.Model) {
        return ImageFileViewComponent;
      }
    } else if (this.currentTab === FileViewType.Records) {
      return OrganizeBrowserComponent;
    } else if (this.currentTab === FileViewType.Models) {
      return SavFileViewComponent;
    } else if (this.currentTab === FileViewType.Bio_Metadata) {
      if (dataItem.getSubType() === SubType.Microscopy && environment.capabilities.microscopy) {
        return MicroscopyViewComponent;
      }
    } else if (this.currentTab === FileViewType.Generic_Metadata) {
      return GenericMetadataPreviewComponent;
    } else {
      return null;
    }
  }

  changeFileView(viewComponent: Type<any>, fileForVisualisation: BrowserDataItem) {
    if (viewComponent === null) {
      return;
    }

    const cmpFactory = this.componentResolver.resolveComponentFactory(viewComponent);
    const component: ComponentRef<IFilePreviewComponent> = this.fileViewContainer.createComponent(cmpFactory) as ComponentRef<
      IFilePreviewComponent
    >;

    this.currentFileViewContainerInstance = component.instance;
    this.currentFileViewContainerInstance.fileItem = fileForVisualisation;
    this.currentFileViewContainerInstance.usingFor = 'records-view';

    if (this.currentFileViewComponent) {
      this.currentFileViewComponent.destroy();
    }
    this.currentFileViewComponent = component;
  }

  changeView(tab: FileViewType) {
    if (!(!this.fileInfo.images && tab === FileViewType.Preview)) {
      this.currentTab = tab;
      this.changeFileView(this.getFileViewComponent(this.fileInfo), this.fileInfo);
    }
  }

  goToAssignInfoBox(item: any, index: any) {
    // this.lastSelectedInfoBoxName = item.name;
    // this.currentTab = 'properties';
    // setTimeout(() => {
    //   this.propertiesInfoBoxComponents.toArray()[index].expand();
    //   const infoBoxContainer = this.infoBoxContainer.nativeElement as HTMLElement;
    //   const infoBoxHeader = infoBoxContainer.querySelector(`[name=${item.name}]`) as HTMLElement;
    //   infoBoxContainer.scrollTo(0, infoBoxHeader.offsetTop - 50);
    // });
  }
}
