import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { BrowserDataItem, NodeType } from 'app/shared/components/organize-browser/browser-types';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BlobsApiService } from 'app/core/services/api/blobs-api.service';
import { IFilePreviewComponent } from 'app/shared/components/file-views/file-view.model';
import { ImagesApiService } from 'app/core/services/api/images-api.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'dr-cif-preview',
  templateUrl: './cif-preview.component.html',
  styleUrls: ['./cif-preview.component.scss']
})
export class CifPreviewComponent implements OnInit, AfterViewInit, IFilePreviewComponent {

  @Input() fileItem: BrowserDataItem = null;
  @Input() viewType: string;

  filePath: SafeResourceUrl;

  constructor(
    private blobsApi: BlobsApiService,
    private imagesApi: ImagesApiService,
    private domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.filePath = this.getFileURL(this.fileItem);
    });
  }

  getFileURL(item: BrowserDataItem) {
    const viewerUrl = '/jsmol/jsmol.htm?_USE=HTML5&url=' + this.blobsApi.getBlobUrl(this.fileItem)
      + '&env=' + environment.proxyJSMOL;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(viewerUrl);
    // return this.domSanitizer.bypassSecurityTrustResourceUrl('api/TYPESCRIPT_DESIGN_PATTERNS.pdf');
  }

  getImageURL(item: BrowserDataItem): string {
    if (item.images) {
      for (const i of item.images) {
        if (i.scale === 'Vector' || i.scale === 'Large') {
          return this.imagesApi.getImageUrlNew(i, item);
        }
      }
    } else {
      return `/img/svg/file-types/cif.svg`;
    }
  }

}
