import { Component, OnInit, Inject, EventEmitter, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidateFolderName, ValidationMessages } from 'app/core/services/validation/validation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NodeType } from '../../organize-browser/browser-types';

@Component({
  selector: 'dr-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.scss'],
})
export class CreateFolderComponent implements OnInit {

  createFolderEvent = new EventEmitter<string>();
  createFolderDialog: FormGroup = null;
  validationMessages: {}[] = null;

  constructor(public dialogRef: MatDialogRef<CreateFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private vm: ValidationMessages) {
    this.createFolderDialog = this.fb.group({
      folderName: ['', Validators.compose([Validators.required, ValidateFolderName, Validators.maxLength(255)])],
    });
    this.validationMessages = this.vm.getNodeNameValidationMessages(NodeType[NodeType.Folder]);
  }

  @HostListener('document:keydown', ['$event'])
  onEnterKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 13) { this.onSubmit(); }
  }

  ngOnInit() {
  }

  onSubmit() {
    this.createFolderEvent.emit(this.createFolderDialog.controls.folderName.value.trim());
    this.dialogRef.close();
  }
}
