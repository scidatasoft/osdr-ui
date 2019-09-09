import {Component, Input, NgZone, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

import {UploadInfoBoxElement} from './upload-info-box.model';

@Component({
  selector: 'dr-upload-info-box',
  templateUrl: './upload-info-box.component.html',
  styleUrls: ['./upload-info-box.component.scss'],
})
export class UploadInfoBoxComponent implements OnInit {

  @Input('actions') actions: UploadInfoBoxElement[] = [];
  private _title = 'Info box';
  isClosed = true;
  collapsed = false;
  isProgress = false;
  allUploadFinishedOk = true;

  constructor(private router: Router, private ngZone: NgZone) {
  }

  finishUpload() {
    this.allUploadFinishedOk = this.isAllFinishedOk();
    this.isProgress = this.existElementInProgress();
  }

  ngOnInit() {
  }

  collapseItems() {
    this.collapsed = !this.collapsed;
  }

  closeInfoBox() {
    this.isClosed = true;
    this.actions = [];
  }

  openInfoBox() {
    this.isClosed = false;
  }

  getOpacity(): string {
    if (this.isClosed) {
      return '0';
    } else {
      return '1';
    }
  }

  getVisibility(): string {
    if (this.isClosed) {
      return 'hidden';
    } else {
      return 'visible';
    }
  }

  countElements(): number {
    return this.actions.length;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  addElementToInfoBox(elementName: string, uploadTask: Observable<any>, uploadPath: string): number {
    const newUploadElement = new UploadInfoBoxElement(elementName, this.ngZone, this.finishUpload.bind(this));
    newUploadElement.uploadTask = uploadTask;
    newUploadElement.uploadPath = uploadPath;

    return this.actions.push(newUploadElement);
  }

  startUpload(elements?: number[]) {
    if (elements && elements.length > 0) {
      for (let i = 0; i < elements.length; i++) {
        this.actions[elements[i]].startProgress();
      }
    } else {
      for (const i of this.actions) {
        if (!i.inProgress) {
          i.startProgress();
        }
      }
    }
    this.finishUpload();
  }

  onCancel(item: UploadInfoBoxElement) {
    item.cancelTask();
    this.finishUpload();
  }

  onRestart(item: UploadInfoBoxElement) {
    item.restartUpload();
    this.finishUpload();
  }

  existElementInProgress(): boolean {
    let exists = false;
    for (const i of this.actions) {
      if (i.inProgress) {
        exists = true;
      }
    }
    return exists;
  }

  isAllFinishedOk(): boolean {
    let ok = true;
    for (const i of this.actions) {
      if (i.canceled || i.finishedWithError || i.inProgress) {
        ok = false;
        break;
      }
    }
    return ok;
  }

  goToFile(item: UploadInfoBoxElement) {
    this.router.navigate([`/organize/${item.uploadPath}`]);
  }

  viewFile(item: UploadInfoBoxElement) {
  }

  onCancelAll() {
    for (const i of this.actions) {
      if (i.inProgress) {
        i.cancelTask();
      }
    }
    this.finishUpload();
  }

  restartAllUpload() {
    for (const i of this.actions) {
      if (i.canceled || i.finishedWithError) {
        i.restartUpload();
      }
    }
    this.finishUpload();
  }
}
