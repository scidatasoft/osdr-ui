import { Component, EventEmitter, HostListener, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ValidateFolderName, ValidationMessages } from 'app/core/services/validation/validation.service';
import { Subscription } from 'rxjs';

import { BrowserDataItem } from '../../organize-browser/browser-types';

@Component({
  selector: 'dr-rename-folder',
  templateUrl: './rename-folder.component.html',
  styleUrls: ['./rename-folder.component.scss'],
  providers: [],
})
export class RenameFolderComponent implements OnInit {

  renameFolderEvent = new EventEmitter<{ item: any, name: string }>();

  public subscriptions: Subscription = null;
  visible: boolean;
  validationMessages: {}[] = null;

  // FormGroups
  folderRenameFG: FormGroup = null;
  targetFolder: BrowserDataItem = null;

  constructor(public dialogRef: MatDialogRef<RenameFolderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private vm: ValidationMessages) {
    this.folderRenameFG = new FormGroup({
      folderName: new FormControl(null, Validators.compose([Validators.required, ValidateFolderName, Validators.maxLength(255)])),
    });
    this.validationMessages = this.vm.getNodeNameValidationMessages((this.data.fileInfo as BrowserDataItem).type);
  }

  @HostListener('document:keydown', ['$event'])
  onEnterKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 13) { this.onSubmit(); }
  }

  ngOnInit() {
    this.openDialog();
  }

  getTitle(): string {
    return this.targetFolder.type.toLowerCase();
  }

  openDialog() {
    this.targetFolder = this.data.fileInfo;

    this.folderRenameFG.setValue({ folderName: this.data.fileInfo.name });
    this.folderRenameFG.get('folderName').markAsUntouched();
  }

  onSubmit() {
    this.renameFolderEvent.emit({ item: this.targetFolder, name: this.folderRenameFG.value['folderName'].trim() });
  }
}
