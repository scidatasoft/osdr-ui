import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntitiesApiService } from 'app/core/services/api/entities-api.service';
import { throwError } from 'rxjs';

import { InfoBoxFactoryService } from '../../info-box/info-box-factory.service';
import { BrowserDataItem } from '../../organize-browser/browser-types';
import { PropertiesInfoBoxComponent } from '../../properties-info-box/properties-info-box.component';
class MicroscopyInfoBox {
  name: string;
  img: string;
  properties: MetadataProperties[];
}

interface MetadataProperties {
  name: string;
  value: string;
}

@Component({
  selector: 'dr-microscopy-view',
  templateUrl: './microscopy-view.component.html',
  styleUrls: ['./microscopy-view.component.scss'],
})
export class MicroscopyViewComponent implements OnInit {
  @Input() fileItem: BrowserDataItem = null;
  @ViewChildren('propertiesInfoBox') propertiesInfoBoxComponents: QueryList<PropertiesInfoBoxComponent>;

  data: MicroscopyInfoBox = undefined;
  message: string = undefined;

  constructor(private entitiesApi: EntitiesApiService, private ffService: InfoBoxFactoryService, private dialog: MatDialog) {}

  ngOnInit() {
    this.getMetadata();
  }

  private async getMetadata(): Promise<any> {
    try {
      const asyncCall = await this.entitiesApi.getEntityMetadataProperties(this.fileItem.id, 'files', 'Properties/BioMetadata').toPromise();
      this.data = { name: 'BioMetadata', img: 'intrinsic.ico', properties: asyncCall };
    } catch (error) {
      this.message = 'Biometric Data is Processing';
    }
  }
}
