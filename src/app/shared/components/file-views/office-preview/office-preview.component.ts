import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ToolbarButtonType } from 'app/shared/components/organize-toolbar/organize-toolbar.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BrowserDataItem } from 'app/shared/components/organize-browser/browser-types';
import { BlobsApiService } from 'app/core/services/api/blobs-api.service';
import { EntitiesApiService } from 'app/core/services/api/entities-api.service';
import {BasePreview} from '../preview-container.model';
import { IFilePreviewComponent } from 'app/shared/components/file-views/file-view.model';

@Component({
  selector: 'dr-office-preview',
  templateUrl: './office-preview.component.html',
  styleUrls: ['./office-preview.component.scss']
})
export class OfficePreviewComponent implements OnInit, AfterViewInit, IFilePreviewComponent {

  fileItem: BrowserDataItem = null;
  filePath: SafeResourceUrl;

  constructor(private blobsApi: BlobsApiService,
    private entitiesApi: EntitiesApiService,
    private domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.entitiesApi.getFileEntity(this.fileItem.id).subscribe(
      (dataFile) => {
        this.fileItem = dataFile;
        this.filePath = this.getFileURL(this.fileItem);
      }
    );
  }

  getFileURL(item) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.blobsApi.getOfficeFileUrl(this.fileItem));
  }

}
