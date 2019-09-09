import { Component, EventEmitter, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BrowserDataItem } from '../../organize-browser/browser-types';

@Component({
  selector: 'dr-delete-folder',
  templateUrl: './delete-folder.component.html',
  styleUrls: ['./delete-folder.component.scss'],
})
export class DeleteFolderComponent implements OnInit {

  deleteFolderEvent = new EventEmitter<void>();
  fileName = null;

  constructor(
    public dialogRef: MatDialogRef<DeleteFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BrowserDataItem[] = []) {
  }

  @HostListener('document:keydown', ['$event'])
  onEnterKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 13) { this.onSubmit(); }
  }

  ngOnInit() {
    this.setItemName();
  }

  getTitle(): string {
    if (this.data.length > 1) {
      return `${this.data.length} elements?`;
    } else if (this.data.length === 1) {
      if (this.data[0].isFolder()) {
        return 'folder?';
      } else {
        return 'file?';
      }
    } else {
      return '';
    }
  }

  setItemName(): void {
    this.fileName = null;
    if (this.data.length === 1) {
      this.fileName = this.data[0];
    }
  }

  onSubmit(): void {
    this.deleteFolderEvent.emit();
  }
}
