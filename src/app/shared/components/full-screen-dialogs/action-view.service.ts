import { Injectable } from '@angular/core';

@Injectable()
export class ActionViewService {

  constructor() { }

  private _isActionViewActive = false;

  get isActionViewActive(): boolean {
    return this._isActionViewActive;
  }

  set isActionViewActive(value: boolean) {
    this._isActionViewActive = value;
  }

}
