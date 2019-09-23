import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { Component, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  private _selectedPortal: BehaviorSubject<Portal<Component | OnInit>> = new BehaviorSubject(null);
  public get selectedPortal(): Portal<Component | OnInit> {
    return this._selectedPortal.value;
  }
  public set selectedPortal(value: Portal<Component | OnInit>) {
    this._selectedPortal.next(value);
  }

  private _componentPortal: BehaviorSubject<ComponentPortal<Component | OnInit>> = new BehaviorSubject(null);
  public set componentPortal(value: ComponentPortal<Component | OnInit>) {
    this._componentPortal.next(value);
  }
}
