import {AfterViewInit, Component, OnInit, Input} from '@angular/core';
import {IFilePreviewComponent} from '../file-view.model';
import {BrowserDataItem, FileType} from '../../organize-browser/browser-types';
import {BlobsApiService} from 'app/core/services/api/blobs-api.service';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {NodesApiService} from 'app/core/services/api/nodes-api.service';

@Component({
  selector: 'dr-pdf-file-view',
  templateUrl: './pdf-file-view.component.html',
  styleUrls: ['./pdf-file-view.component.scss']
})
export class PdfFileViewComponent implements OnInit, AfterViewInit, IFilePreviewComponent {

  @Input() fileItem: BrowserDataItem = null;
  pagePdfUrl: SafeResourceUrl;

  constructor(private blobsApi: BlobsApiService,
              private activatedRoute: ActivatedRoute,
              private domSanitizer: DomSanitizer,
              private nodesApi: NodesApiService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const file_id = this.activatedRoute.snapshot.params['id'];
      if (this.fileItem == null) {
        this.nodesApi.getNode(file_id).subscribe((requestData) => {
          this.fileItem = new BrowserDataItem(requestData.body as BrowserDataItem);
          this.initView();
        });
      } else {
        this.initView();
      }
    });
  }

  initView() {
    if (this.fileItem.fileType() === FileType.pdf || this.fileItem.fileType() === FileType.office
      || this.fileItem.fileType() === FileType.webpage) {

      if (this.fileItem.fileType() === FileType.office) {
        this.pagePdfUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.blobsApi.getOfficeFileUrl(this.fileItem));
      } else {
        this.pagePdfUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.blobsApi.getBlobUrl(this.fileItem));
      }
    }
  }
}
