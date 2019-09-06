import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { BrowserDataItem } from '../../organize-browser/browser-types';
import { EntitiesApiService } from 'app/core/services/api/entities-api.service';
import { InfoBoxFactoryService } from '../../info-box/info-box-factory.service';
import { PropertiesInfoBoxComponent } from '../../properties-info-box/properties-info-box.component';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
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
  styleUrls: ['./microscopy-view.component.scss']
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
