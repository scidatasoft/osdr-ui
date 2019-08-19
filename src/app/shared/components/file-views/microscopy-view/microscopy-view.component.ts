import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { BrowserDataItem } from '../../organize-browser/browser-types';
import { EntitiesApiService } from 'app/core/services/api/entities-api.service';
import { InfoBoxFactoryService } from '../../info-box/info-box-factory.service';
import { PropertiesInfoBoxComponent } from '../../properties-info-box/properties-info-box.component';
import { PropertiesEditorComponent } from '../../properties-editor/properties-editor.component';
import { MatDialog } from '@angular/material';
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

  data: MicroscopyInfoBox = new MicroscopyInfoBox();

  constructor(
    protected entitiesApi: EntitiesApiService,
    protected ffService: InfoBoxFactoryService,
    protected dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getMetadata();
  }

  protected async getMetadata(): Promise<void> {
    const properties = await this.entitiesApi.getEntityMetadataProperties(this.fileItem.id, 'files', 'Properties/BioMetadata').toPromise();

    this.data = { name: 'BioMetadata', img: 'intrinsic.ico', properties: properties };
  }
}
