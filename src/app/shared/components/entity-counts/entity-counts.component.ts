import { Component, NgZone, OnDestroy, OnInit, Optional } from '@angular/core';
import { Subscription } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { NodesApiService } from '../../../core/services/api/nodes-api.service';
import { UsersApiService } from '../../../core/services/api/users-api.service';
import { BrowserDataBaseService } from '../../../core/services/browser-services/browser-data-base.service';
import { IQuickFilter, QuickFilterService } from '../../../core/services/browser-services/quick-filter.service';
import { SignalrService } from '../../../core/services/signalr/signalr.service';
import { NodeEvent, SignalREvent } from '../../../shared/components/notifications/events.model';
import { SidebarContentService } from '../../../shared/components/sidebar-content/sidebar-content.service';
import { EEntityFilter } from '../../../shared/models/entity-filter';
interface ICounter {
  name: string;
  key: string;
  hidden: boolean;
}

enum Capability {
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
export class EntityCountsComponent implements OnInit, OnDestroy {
  private signalRSubscription: Subscription = null;

  data: object = {};
  itemClass = 'all';
  userId = null;
  public: string;
  shared: string;
  filterName: any = EEntityFilter;
  counters: ICounter[] = [
    { name: 'All Files', key: EEntityFilter.ALL, hidden: false },
    { name: 'Shared By Me', key: EEntityFilter.SHARED_BY_ME, hidden: false },
    { name: 'Shared With Me', key: EEntityFilter.SHARED_WITH_ME, hidden: false },
    { name: 'Documents', key: EEntityFilter.DOCUMENTS, hidden: false },
    { name: 'Images', key: EEntityFilter.IMAGES, hidden: false },
    { name: 'Microscopy', key: EEntityFilter.MICROSCOPY, hidden: false },
    { name: 'Models', key: EEntityFilter.MODELS, hidden: false },
    { name: 'Structures', key: EEntityFilter.STRUCTURES, hidden: false },
    { name: 'Crystals', key: EEntityFilter.CRYSTALS, hidden: false },
    { name: 'Reactions', key: EEntityFilter.REACTIONS, hidden: false },
    { name: 'Spectra', key: EEntityFilter.SPECTRA, hidden: false },
    { name: 'Datasets', key: EEntityFilter.DATASETS, hidden: false },
    { name: 'Webpages', key: EEntityFilter.WEBPAGES, hidden: false },
  ];

  filters: {
    capability: Capability;
    filterKey: EEntityFilter[];
  }[] = [
    {
      capability: Capability.LOGIN,
      filterKey: [EEntityFilter.SHARED_BY_ME, EEntityFilter.SHARED_WITH_ME],
    },
    {
      capability: Capability.CRYSTAL,
      filterKey: [EEntityFilter.CRYSTALS],
    },
    {
      capability: Capability.IMAGE,
      filterKey: [EEntityFilter.IMAGES],
    },
    {
      capability: Capability.MACHINELEARNING,
      filterKey: [EEntityFilter.MODELS],
    },
    {
      capability: Capability.MICROSCOPY,
      filterKey: [EEntityFilter.MICROSCOPY],
    },
    {
      capability: Capability.OFFICE,
      filterKey: [EEntityFilter.DOCUMENTS],
    },
    {
      capability: Capability.PDF,
      filterKey: [EEntityFilter.DOCUMENTS],
    },
    {
      capability: Capability.REACTION,
      filterKey: [EEntityFilter.REACTIONS],
    },
    {
      capability: Capability.SPECTRUM,
      filterKey: [EEntityFilter.SPECTRA],
    },
    {
      capability: Capability.WEBPAGE,
      filterKey: [EEntityFilter.WEBPAGES],
    },
    {
      capability: Capability.CHEMICAL,
      filterKey: [EEntityFilter.STRUCTURES],
    },
  ];

  constructor(
    private dataService: BrowserDataBaseService,
    private usersApi: UsersApiService,
    private signalr: SignalrService,
    private ngZone: NgZone,
    private nodesApi: NodesApiService,
    public sidebarContent: SidebarContentService,
    @Optional() private quickFilter: QuickFilterService,
  ) {}

  ngOnInit() {
    this.getCounters();

    const debounceCounters = this.debounce(() => this.getCounters(), 1 * 1000);

    this.signalRSubscription = this.signalr.organizeUpdate.subscribe((x: SignalREvent) => {
      if (
        x.getNodeEvent() === NodeEvent.FileCreated ||
        x.getNodeEvent() === NodeEvent.FileDeleted ||
        x.getNodeEvent() === NodeEvent.PermissionsChanged
      ) {
        debounceCounters();
      }
    });

    if (this.quickFilter) {
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
        setTimeout(() => {
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
    if (key !== 'all') {
      this.dataService.browserLoading = true;
    }
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
        });
      }, 1000);
    });
  }

  getCounters(): void {
    this.sortFilters();

    this.counters.forEach(x => {
      const paramsUrl = this.quickFilter.getFilterByKey(x.key);

      if (x.key === 'sharedWithMe') {
        this.nodesApi.getPublicNodesHead(paramsUrl).subscribe((y: { totalCount: number }) => {
          this.data[x.key] = y.totalCount || 0;
        });
      } else if (x.key === 'all') {
        this.nodesApi.getNodeWithFilter(paramsUrl).subscribe((y: { totalCount: number }) => {
          this.data[x.key] = y.totalCount || 0;
        });
      } else {
        this.usersApi.getEntityCounts(paramsUrl).subscribe((y: { totalCount: number }) => {
          this.data[x.key] = y.totalCount || 0;
        });
      }
    });
  }

  dblClick() {
    console.log('!!!!!');
  }

  sortFilters() {
    const forbiddenCapabilities: string[] = Object.keys(environment.capabilities).filter(k => !environment.capabilities[k]);

    forbiddenCapabilities.forEach((capability: string) => {
      const filter = this.filters.find(x => x.capability === capability);

      if (filter) {
        this.counters = this.counters.filter((c: ICounter) => filter.filterKey.find((d: string) => c.key !== d));
      }
    });
  }
}
