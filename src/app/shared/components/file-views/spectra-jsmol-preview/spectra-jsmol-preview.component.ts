import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { BrowserDataItem } from 'app/shared/components/organize-browser/browser-types';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BlobsApiService } from 'app/core/services/api/blobs-api.service';
import { IFilePreviewComponent } from 'app/shared/components/file-views/file-view.model';
import { ImagesApiService } from 'app/core/services/api/images-api.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'dr-spectra-jsmol-preview',
  templateUrl: './spectra-jsmol-preview.component.html',
  styleUrls: ['./spectra-jsmol-preview.component.scss']
})
export class SpectraJsmolPreviewComponent implements OnInit, AfterViewInit, IFilePreviewComponent {

  @Input() fileItem: BrowserDataItem = null;
  filePath: SafeResourceUrl;

  constructor(
    private blobsApi: BlobsApiService,
    private domSanitizer: DomSanitizer,
    private imagesApi: ImagesApiService,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.filePath = this.getFileURL(this.fileItem);
    });
  }

  getFileURL(item) {
    const viewerUrl = '/jsmol/jsmolspectra.htm?_USE=HTML5&url=' + this.blobsApi.getBlobUrl(this.fileItem)
      + '&env=' + environment.proxyJSMOL;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(viewerUrl);
    // return this.domSanitizer.bypassSecurityTrustResourceUrl('api/TYPESCRIPT_DESIGN_PATTERNS.pdf');
  }

  getImageURL(item): string {
    if (item.images) {
      for (const i of item.images) {
        if (i.scale === 'Vector' || i.scale === 'Large') {
          return this.imagesApi.getImageUrlNew(i, item);
        }
      }
    } else {
      return '';
    }
  }
}
