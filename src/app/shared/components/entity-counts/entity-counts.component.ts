import {
  Component,
  NgZone,
  OnInit,
  OnDestroy,
  Optional,
  AfterViewInit,
} from '@angular/core';
import { UsersApiService } from '../../../core/services/api/users-api.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SignalrService } from '../../../core/services/signalr/signalr.service';
import {
  NodeEvent,
  SignalREvent,
} from '../../../shared/components/notifications/events.model';
import { Subscription } from 'rxjs';
import { SidebarContentService } from '../../../shared/components/sidebar-content/sidebar-content.service';
import {
  IQuickFilter,
  QuickFilterService,
} from '../../../core/services/browser-services/quick-filter.service';
import { NodesApiService } from '../../../core/services/api/nodes-api.service';
import { BrowserDataBaseService } from '../../../core/services/browser-services/browser-data-base.service';
import { environment } from '../../../../environments/environment';

interface ICounter {
  name: string;
  key: string;
  hidden: boolean;
}

enum Counter {
  SHARED_BY_ME = 'sharedByMe',
  SHARED_WITH_ME = 'sharedWithMe',
  DOCUMENTS = 'documents',
  IMAGES = 'images',
  MODELS = 'models',
  STRUCTURES = 'structures',
  CRYSTALS = 'crystals',
  REACTIONS = 'reactions',
  SPECTRA = 'spectra',
  DATASETS = 'datasets',
  WEBPAGES = 'webpages',
  MICROSCOPY = 'microscopy',
}

interface ICapability {
  chemical: boolean;
  crystal: boolean;
  image: boolean;
  machineLearning: boolean;
  microscopy: boolean;
  office: boolean;
  pdf: boolean;
  reaction: boolean;
  spectrum: boolean;
  tabular: boolean;
  webPage: boolean;
  login: boolean;
}

enum Capabilities {
  CHEMICAL = 'chemical',
  CRYSTAL = 'crystal',
  IMAGE = 'image',
  MACHINELEARNING = 'machineLearning',
  MICROSCOPY = 'microscopy',
  OFFICE = 'office',
  PDF = 'pdf',
  REACTION = 'reaction',
  SPECTRUM = 'spectrum',
  TABULAR = 'tabular',
  WEBPAGE = 'webPage',
  LOGIN = 'login',
}

@Component({
  selector: 'dr-entity-counts',
  templateUrl: './entity-counts.component.html',
  styleUrls: ['./entity-counts.component.scss'],
})
export class EntityCountsComponent implements OnInit, OnDestroy, AfterViewInit {
  private signalRSubscription: Subscription = null;
  private filterSubscription: Subscription;

  counters: ICounter[] = [
    { name: 'Shared By Me', key: Counter.SHARED_BY_ME, hidden: false },
    { name: 'Shared With Me', key: Counter.SHARED_WITH_ME, hidden: false },
    { name: 'Documents', key: Counter.DOCUMENTS, hidden: false },
    { name: 'Images', key: Counter.IMAGES, hidden: false },
    { name: 'Models', key: Counter.MODELS, hidden: false },
    { name: 'Structures', key: Counter.STRUCTURES, hidden: false },
    { name: 'Crystals', key: Counter.CRYSTALS, hidden: false },
    { name: 'Reactions', key: Counter.REACTIONS, hidden: false },
    { name: 'Spectra', key: Counter.SPECTRA, hidden: false },
    { name: 'Datasets', key: Counter.DATASETS, hidden: false },
    { name: 'Webpages', key: Counter.WEBPAGES, hidden: false },
  ];

  data: object = {};
  itemClass = 'all';
  userId = null;
  public: string;
  shared: string;
  private progress = false;

  constructor(
    private dataService: BrowserDataBaseService,
    private usersApi: UsersApiService,
    private auth: AuthService,
    private signalr: SignalrService,
    private ngZone: NgZone,
    private nodesApi: NodesApiService,
    public sidebarContent: SidebarContentService,
    @Optional() private quickFilter: QuickFilterService,
  ) {}

  ngOnInit() {
    this.getCounters();

    const debounceCounters = this.debounce(() => this.getCounters(), 1 * 1000);

    this.signalRSubscription = this.signalr.organizeUpdate.subscribe(
      (x: SignalREvent) => {
        if (
          x.getNodeEvent() === NodeEvent.FileCreated ||
          x.getNodeEvent() === NodeEvent.FileDeleted ||
          x.getNodeEvent() === NodeEvent.PermissionsChanged
        ) {
          debounceCounters();
        }
      },
    );

    if (this.quickFilter) {
      this.filterSubscription = this.quickFilter.initFilterEvents.subscribe(
        (filterEvent: IQuickFilter) => {
          this.filterChange(filterEvent);
        },
      );
    }

    if (this.quickFilter) {
      const filter: IQuickFilter = this.quickFilter.getFilterState();
      if (filter.isFilterSet === true) {
        this.itemClass = filter.filterValue;
      }
    }
  }

  ngOnDestroy() {
    this.signalRSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {}

  filterChange(filterEvent: IQuickFilter) {
    if (filterEvent.isFilterSet === true) {
      this.itemClass = filterEvent.filterValue;
    } else {
      this.itemClass = null;
    }
  }

  debounce(f: { (): void; apply?: any }, ms: number) {
    let state = false;
    return () => {
      if (state) {
        return;
      }
      f.apply(this);
      state = true;

      this.ngZone.runOutsideAngular(() => {
        setTimeout(function() {
          state = null;
        }, ms);
      });
    };
  }

  getEntityName(key: string): void {
    this.itemClass = key;
    this.quickFilter.changeFilterState({
      filterValue: key,
      isFilterSet: true,
    } as IQuickFilter);
    this.progress = true;
    if (key !== 'all') {
      this.dataService.browserLoading = true;
    }
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.progress = false;
        });
      }, 1000);
    });
  }

  getCounters(): void {
    const forbiddenCapabilities: string[] = Object.keys(
      environment.capabilities,
    ).filter(k => !environment.capabilities[k]);

    forbiddenCapabilities.forEach((capability: Capabilities) => {
      if (capability === Capabilities.LOGIN) {
        this.counters = this.counters.filter(
          counter =>
            counter.key !== Counter.SHARED_BY_ME &&
            counter.key !== Counter.SHARED_WITH_ME,
        );
      } else if (capability === Capabilities.CRYSTAL) {
        this.counters = this.counters.filter(
          counter => counter.key !== Counter.CRYSTALS,
        );
      } else if (capability === Capabilities.IMAGE) {
        this.counters = this.counters.filter(
          counter => counter.key !== Counter.IMAGES,
        );
      } else if (capability === Capabilities.MACHINELEARNING) {
        this.counters = this.counters.filter(
          counter => counter.key !== Counter.MODELS,
        );
      } else if (capability === Capabilities.MICROSCOPY) {
        this.counters = this.counters.filter(
          counter => counter.key !== Counter.MICROSCOPY,
        );
      } else if (capability === Capabilities.OFFICE) {
        this.counters = this.counters.filter(
          counter => counter.key !== Counter.DOCUMENTS,
        );
      } else if (capability === Capabilities.PDF) {
        this.counters = this.counters.filter(
          counter => counter.key !== Counter.DOCUMENTS,
        );
      } else if (capability === Capabilities.REACTION) {
        this.counters = this.counters.filter(
          counter => counter.key !== Counter.REACTIONS,
        );
      } else if (capability === Capabilities.SPECTRUM) {
        this.counters = this.counters.filter(
          counter => counter.key !== Counter.SPECTRA,
        );
      } else if (capability === Capabilities.TABULAR) {
        this.counters = this.counters.filter(
          counter => counter.key !== Counter.DATASETS,
        );
      } else if (capability === Capabilities.WEBPAGE) {
        this.counters = this.counters.filter(
          counter => counter.key !== Counter.WEBPAGES,
        );
      }
    });

    this.counters.forEach(x => {
      // console.log(x.key);
      const paramsUrl = this.quickFilter.getFilterByKey(x.key);
      if (x.key === 'sharedWithMe') {
        this.nodesApi
          .getPublicNodesHead(paramsUrl)
          .subscribe((y: { totalCount: number }) => {
            this.data[x.key] = y.totalCount || 0;
          });
      } else {
        this.usersApi
          .getEntityCounts(paramsUrl)
          .subscribe((y: { totalCount: number }) => {
            this.data[x.key] = y.totalCount || 0;
          });
      }
    });
  }

  dblClick() {
    console.log('!!!!!');
  }
}
