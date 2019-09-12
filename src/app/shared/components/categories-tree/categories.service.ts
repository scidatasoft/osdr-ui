import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CategoryNode } from './CategoryNode';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private _category: BehaviorSubject<CategoryNode> = new BehaviorSubject({ guid: '', title: 'Not Selected' });
  public get category(): CategoryNode {
    return this._category.value;
  }
  public set category(value: CategoryNode) {
    this._category.next(value);
  }
}
