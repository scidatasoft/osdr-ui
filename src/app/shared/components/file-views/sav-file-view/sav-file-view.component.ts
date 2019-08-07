import { Component, OnInit, Input } from '@angular/core';
import { IFilePreviewComponent } from '../file-view.model';
import { BrowserDataItem } from '../../organize-browser/browser-types';
import { EntitiesApiService } from '../../../../core/services/api/entities-api.service';

@Component({
  selector: 'dr-sav-file-view',
  templateUrl: './sav-file-view.component.html',
  styleUrls: ['./sav-file-view.component.scss'],
})
export class SavFileViewComponent implements OnInit, IFilePreviewComponent {
  @Input() fileItem: BrowserDataItem = null;
  modelInfoArr = [];
  data: any;

  constructor(private entitiesApi: EntitiesApiService) {}

  ngOnInit() {
    const exludeParamsList = ['SourceBlobId', 'SourceBucket', 'UserId'];

    this.entitiesApi.getEntityMetadata(this.fileItem.id, this.fileItem.type).subscribe(x => {
      const info = x as any;
      const metadata = JSON.parse(info.metadata.modelInfo);
      if (metadata) {
        const fps = metadata.Fingerprints.map((fp: { Type: any; Size: any; Radius: any }) => {
          return {
            name: 'Fingerprint',
            value: `Type: ${fp.Type ? fp.Type : null}, Size: ${fp.Size ? fp.Size : null} , Radius: ${fp.Radius ? fp.Radius : null}`,
          };
        });
        const dataset = [
          {
            name: 'Dataset. Title',
            value: metadata.Dataset.Title,
          },
          {
            name: 'Dataset. Description',
            value: metadata.Dataset.Description,
          },
        ];
        const property = [
          {
            name: 'Property. Name',
            value: metadata.Property.Name,
          },
          {
            name: 'Property. Description',
            value: metadata.Property.Description,
          },
          {
            name: 'Property. Category',
            value: metadata.Property.Category,
          },
          {
            name: 'Property. Units',
            value: metadata.Property.Units,
          },
        ];
        delete metadata.Fingerprints;
        delete metadata.Dataset;
        delete metadata.Property;
        const items = Object.keys(metadata)
          .map(name => ({ name, value: metadata[name] }))
          .filter(z => exludeParamsList.indexOf(z.name) < 0);
        this.data = {
          name: info.fileName,
          properties: [...items, ...fps, ...dataset, ...property],
          img: 'intrinsic.ico',
        };
      } else {
        this.data = null;
      }
    });
  }
}
