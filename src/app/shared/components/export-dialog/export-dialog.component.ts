import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { BlobsApiService } from 'app/core/services/api/blobs-api.service';
import { ExportChemFilesService } from 'app/core/services/export-files/export-chem-files.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'dr-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss'],
})
export class ExportDialogComponent implements OnInit {

  @ViewChildren('properties') pList: QueryList<MatSelectionList>;

  infoboxTitles: string[] = [];
  propertiesList = [];
  fileRecordsKeys: string[] = [];
  recordsKeys = {};
  selectedOptionsValues: string[] = [];
  selectedFilesBlobIdList: string[];
  selectedOptions = { fields: {}, chemicalProperties: {} };

  constructor(
    public http: HttpClient,
    private exportService: ExportChemFilesService,
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    const selectedFilesIdList = this.data.selectedItems.map(x => x.id);
    this.selectedFilesBlobIdList = this.data.selectedItems.map(x => x.blob.id);
    const observables = this.exportService.getFileProperties(selectedFilesIdList);

    forkJoin(observables).subscribe(result => {
      this.propertiesList = result.map((x: any) => x.properties);
      this.crossFileFilter();
    });
  }

  crossFileFilter() {
    this.fileRecordsKeys = Object.keys(this.propertiesList[0] || {});
    for (let i = 0; i < this.propertiesList.length; i++) {
      const item = this.propertiesList[i];
      this.fileRecordsKeys = this.fileRecordsKeys.filter(x => Object.keys(item).indexOf(x) >= 0);
    }
    for (let i = 0; i < this.propertiesList.length; i++) {
      const item = this.propertiesList[i];
      for (const key in item) {
        if (item.hasOwnProperty(key) && this.fileRecordsKeys.indexOf(key) < 0) {
          delete item[key];
        }
      }
    }
    this.fileRecordsKeys.forEach(x => this.recordsKeys[x] = (this.propertiesList[0] || {})[x].map(y => y));
    for (let i = 0; i < this.propertiesList.length; i++) {
      for (const key in this.propertiesList[i]) {
        if (this.propertiesList[i].hasOwnProperty(key)) {
          const keys = this.propertiesList[i][key].map(y => y);
          this.recordsKeys[key] = this.recordsKeys[key].filter(x => keys.indexOf(x) >= 0);
        }
      }
    }
    for (let i = 0; i < this.propertiesList.length; i++) {
      const item = this.propertiesList[i];
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          item[key] = item[key].filter(x => this.recordsKeys[key].indexOf(x) > 0);
        }
      }
    }
    let j = this.fileRecordsKeys.length;
    while (j--) {
      const key = this.fileRecordsKeys[j];
      if (this.recordsKeys[key].length === 0 || (this.recordsKeys[key].length && this.recordsKeys[key][0] === undefined)) {
        delete this.recordsKeys[key];
        this.fileRecordsKeys.splice(this.fileRecordsKeys.indexOf(key), 1);
      }
    }
  }

  reverseSelection(properties: MatSelectionList) {
    properties.options.toArray().forEach(x => x.selected = !x.selected);
  }

  cleanPreview(): void {
    this.fileRecordsKeys = [];
    this.recordsKeys = {};
  }

  generateRequestData() {
    const exportData = {
      'BlobId': this.selectedFilesBlobIdList[0],
      'Format': this.data.fileType || 'csv',
      'Properties': [],
    };

    this.selectedOptionsValues = [];
    this.pList.toArray().forEach(x => {
      x.selectedOptions.selected.map(item => item.value).forEach(y => {
        this.selectedOptionsValues.push(y);
      });
    });
    const newSet = new Set(this.selectedOptionsValues);
    const it = newSet.values();
    this.selectedOptionsValues = Array.from(it);
    this.fileRecordsKeys.forEach(propType => {
      this.selectedOptionsValues.forEach(x => {
        if (propType === 'fields' && this.recordsKeys[propType].includes(x)) {
          exportData['Properties'].push({ 'Name': 'Properties.Fields.' + x, 'ExportName': x });
        } else if (propType === 'chemicalProperties' && this.recordsKeys[propType].includes(x) && x !== 'SMILES') {
          exportData['Properties'].push({ 'Name': 'Properties.ChemicalProperties.' + x, 'ExportName': x });
        }
      });
    });
    return exportData;
  }

  sendToExport(): void {
    this.exportService.exportChemFiles(this.generateRequestData());
    this.dialogRef.close();
  }
}
