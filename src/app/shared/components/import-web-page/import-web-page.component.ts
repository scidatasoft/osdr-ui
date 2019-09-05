import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationMessages, ValidateWebPageUrl } from 'app/core/services/validation/validation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'dr-import-web-page',
  templateUrl: './import-web-page.component.html',
  styleUrls: ['./import-web-page.component.scss']
})
export class ImportWebPageComponent implements OnInit {

  importPageEvent = new EventEmitter<string>();

  // FormGroups
  importWebPageFG: FormGroup = null;

  validationMessages: { type: string, message: string }[] = null;

  constructor(
    public dialogRef: MatDialogRef<ImportWebPageComponent>,
    private vm: ValidationMessages
  ) {
    this.validationMessages = this.vm.web_page_validation_messages;
  }

  ngOnInit() {
    this.openDialog();
  }

  openDialog() {
    this.importWebPageFG = new FormGroup({
      siteUrl: new FormControl(null, [Validators.required, ValidateWebPageUrl])
    });
  }

  onSubmit() {
    this.importPageEvent.emit(this.importWebPageFG.value['siteUrl']);
  }
}
