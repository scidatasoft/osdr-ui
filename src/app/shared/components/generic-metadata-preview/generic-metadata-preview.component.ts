import { Component, Input, OnInit } from '@angular/core';
import { EntitiesApiService } from 'app/core/services/api/entities-api.service';
import { MetadataApiService } from 'app/core/services/api/metadata-api.service';

import { BrowserDataItem } from '../organize-browser/browser-types';

enum EGenericMetadata {
  Project = 'Project',
  Experimenter = 'Experimenter',
  Experimenter_Group = 'Experimenter Group',
  Experiment_Name = 'Experiment Name',
  Experiment_Date = 'Experiment Date',
  Original_Folder_path = 'Original Folder (path)',
  Instrument_Device_Name = 'Instrument Device Name',
  Notes = 'Notes',
}

interface IGenericMetadata {
  name: EGenericMetadata;
  value: string;
}

@Component({
  selector: 'dr-generic-metadata-preview',
  templateUrl: './generic-metadata-preview.component.html',
  styleUrls: ['./generic-metadata-preview.component.scss'],
})
export class GenericMetadataPreviewComponent implements OnInit {
  /**
   * Metadata mock
   */

  mockedMetadata: IGenericMetadata[] = [
    { name: EGenericMetadata.Project, value: `Leanda` },
    { name: EGenericMetadata.Experimenter, value: `John Doe` },
    { name: EGenericMetadata.Experimenter_Group, value: `Harward Science` },
    { name: EGenericMetadata.Experiment_Name, value: `Chemical Experiment NH12094` },
    {
      name: EGenericMetadata.Experiment_Date,
      value: `${new Date(+new Date() - Math.floor(Math.random() * 10000000000)).toLocaleDateString()}`,
    },
    { name: EGenericMetadata.Original_Folder_path, value: `Drafts` },
    { name: EGenericMetadata.Instrument_Device_Name, value: `Laboratory Microscope` },
    { name: EGenericMetadata.Notes, value: `Experimenter had to consume a lot of coffee` },
  ];

  data: { img: string; name: string; properties: IGenericMetadata[] } = { img: 'intrinsic.ico', name: 'File Information', properties: [] };

  // end

  @Input() fileItem: BrowserDataItem;

  // protected metadata: IGenericMetadata[];

  constructor(private api: MetadataApiService, private entitiesApi: EntitiesApiService) {}

  ngOnInit() {
    this.data.properties = this.mockedMetadata;
    // this.getMetadata();
  }

  protected async getMetadata(): Promise<void> {
    const properties = await this.entitiesApi.getEntityMetadataProperties(this.fileItem.id, 'files', 'Properties/BioMetadata').toPromise();

    this.data.properties = properties;
  }
}
