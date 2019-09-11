/**
 * Category data with nested structure.
 * Each node has a name and an optiona list of children.
 */
export interface CategoryNode {
  guid: string;
  title: string;
  children?: CategoryNode[];
}
