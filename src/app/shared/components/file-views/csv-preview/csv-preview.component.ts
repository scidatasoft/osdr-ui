import { Component, Input, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { BrowserDataItem } from 'app/shared/components/organize-browser/browser-types';
import * as Papa from 'papaparse';
import { BlobsApiService } from 'app/core/services/api/blobs-api.service';
import { IFilePreviewComponent } from 'app/shared/components/file-views/file-view.model';
import { EntitiesApiService } from 'app/core/services/api/entities-api.service';
import { ToolbarButtonType } from 'app/shared/components/organize-toolbar/organize-toolbar.model';

@Component({
  selector: 'dr-csv-preview',
  templateUrl: './csv-preview.component.html',
  styleUrls: ['./csv-preview.component.scss']
})
export class CSVPreviewComponent implements OnInit, AfterViewInit, IFilePreviewComponent {
  activeToolbarButtons: ToolbarButtonType[] = [];

  dataArrayFromFile: any = [];
  fileItem: BrowserDataItem = null;

  constructor(private blobsApi: BlobsApiService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const blobUrl = this.blobsApi.getBlobUrl(this.fileItem);
    // const blobUrl = 'api/classic_ML.csv';

    const parsed = Papa.parse(blobUrl, {
      download: true,
      complete: (results) => {
        this.dataArrayFromFile = results.data;
        for (const i in this.dataArrayFromFile) {
          if (this.dataArrayFromFile[i].length === 1) {
            this.dataArrayFromFile.splice(i, i);
          }
        }
      }
    });
  }

  getTableBody() {
    return this.dataArrayFromFile.slice(1);
  }

  getTableHeader() {
    return this.dataArrayFromFile[0];
  }

  getActiveButtons(): ToolbarButtonType[] {
    return this.activeToolbarButtons;
  }

}
