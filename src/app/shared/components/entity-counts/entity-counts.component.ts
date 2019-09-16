import { Component, NgZone, OnDestroy, OnInit, Optional } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { BrowserDataBaseService } from '../../../core/services/browser-services/browser-data-base.service';
import { IQuickFilter, QuickFilterService } from '../../../core/services/browser-services/quick-filter.service';
import { SignalrService } from '../../../core/services/signalr/signalr.service';
import { NodeEvent, SignalREvent } from '../../../shared/components/notifications/events.model';
import { SidebarContentService } from '../../../shared/components/sidebar-content/sidebar-content.service';
import { EEntityFilter, ICounter } from '../../../shared/models/entity-filter';

import { EntityCountsService } from './entity-counts.service';

@Component({
  selector: 'dr-entity-counts',
  templateUrl: './entity-counts.component.html',
  styleUrls: ['./entity-counts.component.scss'],
})
export class EntityCountsComponent implements OnInit, OnDestroy {
  private signalRSubscription: Subscription = null;

  counters: Observable<ICounter[]>;
  itemClass = 'all';
  userId = null;
  public: string;
  shared: string;
  filterName: any = EEntityFilter;

  constructor(
    private dataService: BrowserDataBaseService,
    private signalr: SignalrService,
    private ngZone: NgZone,
    private service: EntityCountsService,
    public sidebarContent: SidebarContentService,
    private quickFilter: QuickFilterService,
  ) {}

  ngOnInit() {
    this.service.activeFilter = EEntityFilter.ALL;
    this.counters = this.service.entities$.asObservable();
    this.service.sortFilters();
    this.service.updateCounters();

    const debounceCounters = this.debounce(() => this.service.updateCounters(), 1 * 1000);

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
      const filter: IQuickFilter = this.quickFilter.getFilterState();
      if (filter.isFilterSet === true) {
        this.itemClass = filter.filterValue;
      }
    }
  }

  ngOnDestroy() {
    this.signalRSubscription.unsubscribe();
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

  getEntityName(key: EEntityFilter): void {
    this.service.activeFilter = key;
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
        this.ngZone.run(() => {});
      }, 1000);
    });
  }

  dblClick() {
    console.log('!!!!!');
  }
}
