import { Component, OnInit, Input } from '@angular/core';
import { MetadataApiService } from 'app/core/services/api/metadata-api.service';
import { BrowserDataItem } from '../organize-browser/browser-types';
import { EntitiesApiService } from 'app/core/services/api/entities-api.service';

enum GenericMetadata {
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
  name: GenericMetadata;
  value: string;
}

@Component({
  selector: 'dr-generic-metadata-preview',
  templateUrl: './generic-metadata-preview.component.html',
  styleUrls: ['./generic-metadata-preview.component.scss']
})
export class GenericMetadataPreviewComponent implements OnInit {

  /**
   * Metadata mock
   */

  metadata: IGenericMetadata[] = [
    { name: GenericMetadata.Project, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { name: GenericMetadata.Experimenter, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { name: GenericMetadata.Experimenter_Group, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { name: GenericMetadata.Experiment_Name, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { name: GenericMetadata.Experiment_Date, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { name: GenericMetadata.Original_Folder_path, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { name: GenericMetadata.Instrument_Device_Name, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { name: GenericMetadata.Notes, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
  ];

  // end

  @Input() fileItem: BrowserDataItem;

  // protected metadata: IGenericMetadata[];

  constructor(private api: MetadataApiService, private entitiesApi: EntitiesApiService) { }

  ngOnInit() {
    // this.getMetadata();
  }

  protected async getMetadata(): Promise<void> {
    const properties = await this.entitiesApi.getEntityMetadataProperties(this.fileItem.id, 'files', 'Properties/BioMetadata').toPromise();

    this.metadata = properties;
  }

}
