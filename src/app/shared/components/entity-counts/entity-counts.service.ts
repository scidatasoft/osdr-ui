import { Injectable, Optional } from '@angular/core';
import { NodesApiService } from 'app/core/services/api/nodes-api.service';
import { UsersApiService } from 'app/core/services/api/users-api.service';
import { QuickFilterService } from 'app/core/services/browser-services/quick-filter.service';
import { Capability, EEntityFilter, ICounter, IFilter } from 'app/shared/models/entity-filter';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntityCountsService {
  private _activeFilter: BehaviorSubject<EEntityFilter> = new BehaviorSubject(null);
  private _entities: BehaviorSubject<ICounter[]> = new BehaviorSubject([
    { title: 'All Files', key: EEntityFilter.ALL, count: 0, hidden: false },
    { title: 'Shared By Me', key: EEntityFilter.SHARED_BY_ME, count: 0, hidden: false },
    { title: 'Shared With Me', key: EEntityFilter.SHARED_WITH_ME, count: 0, hidden: false },
    { title: 'Documents', key: EEntityFilter.DOCUMENTS, count: 0, hidden: false },
    { title: 'Images', key: EEntityFilter.IMAGES, count: 0, hidden: false },
    { title: 'Microscopy', key: EEntityFilter.MICROSCOPY, count: 0, hidden: false },
    { title: 'Models', key: EEntityFilter.MODELS, count: 0, hidden: false },
    { title: 'Structures', key: EEntityFilter.STRUCTURES, count: 0, hidden: false },
    { title: 'Crystals', key: EEntityFilter.CRYSTALS, count: 0, hidden: false },
    { title: 'Reactions', key: EEntityFilter.REACTIONS, count: 0, hidden: false },
    { title: 'Spectra', key: EEntityFilter.SPECTRA, count: 0, hidden: false },
    { title: 'Datasets', key: EEntityFilter.DATASETS, count: 0, hidden: false },
    { title: 'Webpages', key: EEntityFilter.WEBPAGES, count: 0, hidden: false },
  ]);
  private filters: IFilter[] = [
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

  public get activeFilter(): EEntityFilter {
    return this._activeFilter.value;
  }
  public set activeFilter(value: EEntityFilter) {
    this._activeFilter.next(value);
  }

  public get entities(): ICounter[] {
    return this._entities.value;
  }
  public set entities(value: ICounter[]) {
    this._entities.next(value);
  }

  public get entities$(): BehaviorSubject<ICounter[]> {
    return this._entities;
  }
  public set entities$(value: BehaviorSubject<ICounter[]>) {
    this._entities = value;
  }

  constructor(private usersApi: UsersApiService, private nodesApi: NodesApiService, private quickFilter: QuickFilterService) {}

  public getCounter(key: EEntityFilter): ICounter {
    return this.entities.find(e => e.key === key);
  }

  public updateCounters(): void {
    this.entities.forEach((x: ICounter) => {
      const paramsUrl = this.quickFilter.getFilterByKey(x.key);

      switch (x.key) {
        case 'all':
          this.nodesApi
            .getNodeWithFilter(paramsUrl)
            .subscribe(
              (result: { data: []; page: { totalCount: number } }) =>
                (this.entities.find(k => k.key === x.key).count = result.page.totalCount || 0),
            );
          break;
        case 'sharedWithMe':
          this.nodesApi
            .getPublicNodesHead(paramsUrl)
            .subscribe((result: { totalCount: number }) => (this.entities.find(k => k.key === x.key).count = result.totalCount || 0));
          break;

        default:
          this.usersApi
            .getEntityCounts(paramsUrl)
            .subscribe((result: { totalCount: number }) => (this.entities.find(k => k.key === x.key).count = result.totalCount || 0));
          break;
      }
    });
  }

  public sortFilters(): ICounter[] {
    const forbiddenCapabilities: string[] = Object.keys(environment.capabilities).filter(k => !environment.capabilities[k]);

    let result: ICounter[] = [];

    forbiddenCapabilities.forEach((capability: string) => {
      const filter = this.filters.find(x => x.capability === capability);

      if (filter) {
        result = this.entities.filter((c: ICounter) => filter.filterKey.find((d: string) => c.key !== d));
      } else {
        result = this.entities;
      }
    });

    return result;
  }
}
