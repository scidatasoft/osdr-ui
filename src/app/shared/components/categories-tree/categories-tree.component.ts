import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { EEntityFilter, ICounter } from 'app/shared/models/entity-filter';

import { CategoriesApiService } from '../../../core/services/api/categories-api.service';
import { EntityCountsService } from '../entity-counts/entity-counts.service';
import { SidebarContentService } from '../sidebar-content/sidebar-content.service';

import { CategoriesService } from './categories.service';
import { CategoryNode } from './CategoryNode';

function guid(): string {
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

function s4(): string {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

const TREE_DATA: CategoryNode[] = [
  {
    guid: guid(),
    title: 'Category 1',
    children: [
      { guid: guid(), title: 'Sub-category 1' },
      { guid: guid(), title: 'Sub-category 2' },
      { guid: guid(), title: 'Sub-category 3' },
    ],
  },
  {
    guid: guid(),
    title: 'Category 2',
    children: [
      {
        guid: guid(),
        title: 'Sub-category 1',
        children: [{ guid: guid(), title: 'Sub/Sub-category 1' }, { guid: guid(), title: 'Sub/Sub-category 2' }],
      },
      {
        guid: guid(),
        title: 'Sub-category 2',
        children: [{ guid: guid(), title: 'Sub/Sub-category 1' }, { guid: guid(), title: 'Sub/Sub-category 2' }],
      },
    ],
  },
];

@Component({
  selector: 'dr-categories-tree',
  templateUrl: './categories-tree.component.html',
  styleUrls: ['./categories-tree.component.scss'],
})
export class CategoriesTreeComponent implements OnInit {
  treeControl = new NestedTreeControl<CategoryNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CategoryNode>();
  entitiyFilter: ICounter;
  lastShownPopoverName: string;
  lastShownPopoverTimeoutId: any;

  constructor(
    public sidebarContent: SidebarContentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: CategoriesApiService,
    private service: CategoriesService,
    private entityCounterService: EntityCountsService,
  ) {}

  selectedNode: CategoryNode = { guid: '', title: 'None' };
  currentFilter: EEntityFilter = undefined;

  ngOnInit() {
    // Show Tree Mock before tree is loded
    this.dataSource.data = TREE_DATA;
    this.entitiyFilter = this.entityCounterService.getCounter(EEntityFilter.ALL);
    this.currentFilter = this.entityCounterService.activeFilter;
    this.service.category = this.selectedNode;
    this.getTree();
  }

  hasChild = (_: number, node: CategoryNode) => !!node.children && node.children.length > 0;

  selectCategory(node: CategoryNode): void {
    this.selectedNode = node;
    this.filterByCategory();
  }

  displayAllFiles(): void {
    this.entityCounterService.activeFilter = this.currentFilter = EEntityFilter.ALL;
    this.selectedNode = { guid: '', title: 'None' };
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
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

  private filterByCategory(): Promise<boolean> {
    this.service.category = this.selectedNode;
    return this.router.navigate(['./'], {
      // Filter parameter has to be set once API is ready
      queryParams: {
        $category: `categoryId eq ${this.selectedNode.guid}`,
      },
      relativeTo: this.activatedRoute,
    });
  }

  private getTree(): void {
    this.api
      .getNode()
      .then(tree => (this.dataSource.data = tree))
      .catch(err => (this.dataSource.data = TREE_DATA));
  }
}
