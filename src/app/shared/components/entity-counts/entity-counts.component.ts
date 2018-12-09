import { Component, NgZone, OnInit, OnDestroy, Optional, AfterViewInit } from '@angular/core';
import { UsersApiService } from 'app/core/services/api/users-api.service';
import { AuthService } from 'app/core/services/auth/auth.service';
import { SignalrService } from 'app/core/services/signalr/signalr.service';
import { NodeEvent, SignalREvent } from 'app/shared/components/notifications/events.model';
import { Subscription } from 'rxjs';
import { SidebarContentService } from 'app/shared/components/sidebar-content/sidebar-content.service';
import { IQuickFilter, QuickFilterService } from 'app/core/services/browser-services/quick-filter.service';
import { NodesApiService } from 'app/core/services/api/nodes-api.service';
import { BrowserDataBaseService } from 'app/core/services/browser-services/browser-data-base.service';

@Component({
  selector: 'dr-entity-counts',
  templateUrl: './entity-counts.component.html',
  styleUrls: ['./entity-counts.component.scss']
})

export class EntityCountsComponent implements OnInit, OnDestroy, AfterViewInit {

  private signalRSubscription: Subscription = null;
  private filterSubscription: Subscription;

  counters = [
    { name: 'Shared By Me', key: 'sharedByMe' },
    { name: 'Shared With Me', key: 'sharedWithMe' },
    { name: 'Documents', key: 'documents' },
    { name: 'Images', key: 'images' },
    { name: 'Models', key: 'models' },
    { name: 'Structures', key: 'structures' },
    { name: 'Crystals', key: 'crystals' },
    { name: 'Reactions', key: 'reactions' },
    { name: 'Spectra', key: 'spectra' },
    { name: 'Datasets', key: 'datasets' },
    { name: 'Webpages', key: 'webpages' },
  ];

  data: object = {};
  itemClass = 'all';
  userId = this.auth.user.profile.sub;
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
    @Optional() private quickFilter: QuickFilterService
  ) { }

  ngOnInit() {
    this.getCounters();
    const debounceCounters = this.debounce(() => this.getCounters(), 1 * 1000);
    this.signalRSubscription = this.signalr.organizeUpdate.subscribe((x: SignalREvent) => {
      if (x.getNodeEvent() === NodeEvent.FileCreated || x.getNodeEvent() === NodeEvent.FileDeleted
        || x.getNodeEvent() === NodeEvent.PermissionsChanged) {
        debounceCounters();
      }
    });
    if (this.quickFilter) {
      this.filterSubscription = this.quickFilter.initFilterEvents.subscribe(
        (filterEvent: IQuickFilter) => {
          this.filterChange(filterEvent);
        }
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

  ngAfterViewInit(): void {

  }

  filterChange(filterEvent: IQuickFilter) {
    if (filterEvent.isFilterSet === true) {
      this.itemClass = filterEvent.filterValue;
    } else {
      this.itemClass = null;
    }
  }

  debounce(f, ms) {
    let state = false;
    return () => {
      if (state) {
        return;
      }
      f.apply(this);
      state = true;

      this.ngZone.runOutsideAngular(
        () => {
          setTimeout(function () { state = null; }, ms);
        }
      );
    };
  }

  getEntityName(key): void {
    this.itemClass = key;
    this.quickFilter.changeFilterState({ filterValue: key, isFilterSet: true } as IQuickFilter);
    this.progress = true;
    if (key !== 'all') {
      this.dataService.browserLoading = true;
    }
    this.ngZone.runOutsideAngular(
      () => {
        setTimeout(
          () => {
            this.ngZone.run(
              () => {
                this.progress = false;
              }
            );
          }, 1000
        );
      }
    );
  }

  getCounters(): void {
    this.counters.forEach(x => {
      const paramsUrl = this.quickFilter.getFilterByKey(x.key);
      if (x.key === 'sharedWithMe') {
        this.nodesApi.getPublicNodesHead(paramsUrl).subscribe(
          y => {
            this.data[x.key] = y.totalCount || 0;
          });
      } else {
        this.usersApi.getEntityCounts(paramsUrl).subscribe(
          y => {
            this.data[x.key] = y.totalCount || 0;
          });
      }
    });
  }

  dblClick() {
    console.log('!!!!!');
  }
}
