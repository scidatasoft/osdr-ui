import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';

/**
 * Category data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface CategoryNode {
  id: number;
  title: string;
  children?: CategoryNode[];
}

const TREE_DATA: CategoryNode[] = [
  {
    id: 0,
    title: 'Category 1',
    children: [{ id: 0, title: 'Sub-category 1' }, { id: 1, title: 'Sub-category 2' }, { id: 2, title: 'Sub-category 3' }],
  },
  {
    id: 1,
    title: 'Category 2',
    children: [
      {
        id: 0,
        title: 'Sub-category 1',
        children: [{ id: 0, title: 'Sub/Sub-category 1' }, { id: 1, title: 'Sub/Sub-category 2' }],
      },
      {
        id: 1,
        title: 'Sub-category 2',
        children: [{ id: 0, title: 'Sub/Sub-category 1' }, { id: 1, title: 'Sub/Sub-category 2' }],
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

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: CategoryNode) => !!node.children && node.children.length > 0;
}
