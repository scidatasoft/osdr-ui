import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntitiesApiService } from 'app/core/services/api/entities-api.service';
import { SignalrService } from 'app/core/services/signalr/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dr-properties-editor',
  templateUrl: './properties-editor.component.html',
  styleUrls: ['./properties-editor.component.scss'],
})
export class PropertiesEditorComponent implements OnInit, OnDestroy {
  screen: any;
  collectionData: any = {};
  saving = false;
  organizeUpdateSub: Subscription;
  @Output() save = new EventEmitter<any>();

  constructor(
    private entitiesApi: EntitiesApiService,
    private signalr: SignalrService,
    public dialogRef: MatDialogRef<PropertiesEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.screen = this.data.meta.screens[0];
    this.collectionData = {};
    for (const item of this.data.properties) {
      this.collectionData[item.name] = item.value;
    }
    this.organizeUpdateSub = this.signalr.organizeUpdate.subscribe(x => {
      if (x.EventName === 'FieldsUpdated') {
        this.saving = false;
        this.dialogRef.close();
        this.save.emit(this.data);
      }
    });
  }

  ngOnDestroy(): void {
    this.organizeUpdateSub.unsubscribe();
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.saving = true;
    const record = this.data.record;

    const path = '/Properties/' + this.data.name.charAt(0).toUpperCase() + this.data.name.slice(1);
    const value = [];
    for (const key in this.collectionData) {
      if (this.collectionData.hasOwnProperty(key)) {
        value.push({ name: key, value: this.collectionData[key] });
      }
    }

    this.entitiesApi.patchRecordProperties(record.id, record.version, path, value).subscribe();
  }
}
