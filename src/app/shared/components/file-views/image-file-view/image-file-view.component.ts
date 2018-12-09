import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { IFilePreviewComponent } from '../file-view.model';
import { BrowserDataItem } from '../../organize-browser/browser-types';
import { ImagesApiService } from 'app/core/services/api/images-api.service';
import { ActivatedRoute } from '@angular/router';
import { NodesApiService } from 'app/core/services/api/nodes-api.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'dr-image-file-view',
  templateUrl: './image-file-view.component.html',
  styleUrls: ['./image-file-view.component.scss']
})
export class ImageFileViewComponent implements OnInit, AfterViewInit, IFilePreviewComponent {

  @ViewChild('imagePreview') imagePreview;
  @Input() fileItem;

  constructor(private imagesApi: ImagesApiService,
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private nodesApi: NodesApiService,
    private elRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const file_id = this.activatedRoute.snapshot.params['id'];
      if (this.fileItem == null) {
        this.nodesApi.getNode(file_id).subscribe((requestData) => {
          this.fileItem = new BrowserDataItem(requestData.body as BrowserDataItem);
        });
      }
    });
  }

  onImagePreviewLoad() {
    (window as any).svgPanZoom(this.elRef.nativeElement.querySelector('svg'), {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: true,
      center: true,
    });
  }

  getImageURL(item): string {
    if (item && item.images) {
      for (const i of item.images) {
        if (i.scale === 'Vector' || i.scale === 'Large') {
          return this.imagesApi.getImageUrlNew(i, item);
        }
      }
    } else {
      const fileType = item.name.split('.').pop().toLowerCase();

      const knownTypes = ' .pdf .xls .xlsx .doc .docx .ppt .pptx' +
        ' .zip .rar .7z .arj .wav .l.p3 .ogg .aac .wma .ape .flac' +
        ' .tif .tiff .gif .jpeg .jpg .jif .jfif .jp2 .jpx .j2k .fpx .pcd .png .bmp' +
        ' .mpg .mpeg .mp4 .txt .rtf .csv .tsv .xml .html .htm' +
        ' .mol .sdf .cdx .rxn .rdf .jdx .dx .cif';
      if (knownTypes.indexOf(' .' + fileType) < 0) {
        return item.type === 'Record' ? '/img/svg/file-types/record.svg' : '/img/svg/tile/file.svg';
      } else {
        return `/img/svg/file-types/${fileType}.svg`;
      }
    }
  }
}
