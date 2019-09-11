import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';

/**
 * Category data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface CategoryNode {
  id: string;
  title: string;
  children?: CategoryNode[];
}

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
    id: guid(),
    title: 'Category 1',
    children: [{ id: guid(), title: 'Sub-category 1' }, { id: guid(), title: 'Sub-category 2' }, { id: guid(), title: 'Sub-category 3' }],
  },
  {
    id: guid(),
    title: 'Category 2',
    children: [
      {
        id: guid(),
        title: 'Sub-category 1',
        children: [{ id: guid(), title: 'Sub/Sub-category 1' }, { id: guid(), title: 'Sub/Sub-category 2' }],
      },
      {
        id: guid(),
        title: 'Sub-category 2',
        children: [{ id: guid(), title: 'Sub/Sub-category 1' }, { id: guid(), title: 'Sub/Sub-category 2' }],
      },
    ],
  },
];

@Component({
  selector: 'dr-categories-tree',
  templateUrl: './categories-tree.component.html',
  styleUrls: ['./categories-tree.component.scss'],
})
export class CategoriesTreeComponent {
  treeControl = new NestedTreeControl<CategoryNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CategoryNode>();

  selectedNode: string = '';

  constructor() {
    this.dataSource.data = TREE_DATA;
    console.log(TREE_DATA);
  }

  hasChild = (_: number, node: CategoryNode) => !!node.children && node.children.length > 0;
}
