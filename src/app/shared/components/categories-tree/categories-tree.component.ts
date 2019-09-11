import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';

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
    children: [{ guid: guid(), title: 'Sub-category 1' }, { guid: guid(), title: 'Sub-category 2' }, { guid: guid(), title: 'Sub-category 3' }],
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

  selectedNode: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {}

  hasChild = (_: number, node: CategoryNode) => !!node.children && node.children.length > 0;

  selectCategory(node: CategoryNode): void {
    this.selectedNode = node.guid;
    this.filterByCategory();
  }

  private filterByCategory(): Promise<boolean> {
    return this.router.navigate(['./'], {
      // Filter parameter has to be set once API is ready
      queryParams: {
        $filter: `categoryId eq ${this.selectedNode}`,
      },
      relativeTo: this.activatedRoute,
    });
  }
}
