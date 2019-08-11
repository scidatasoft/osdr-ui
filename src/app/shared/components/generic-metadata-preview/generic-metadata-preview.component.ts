import { Component, OnInit, Input } from '@angular/core';
import { MetadataApiService } from 'app/core/services/api/metadata-api.service';
import { BrowserDataItem } from '../organize-browser/browser-types';

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
  key: GenericMetadata;
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
    { key: GenericMetadata.Project, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { key: GenericMetadata.Experimenter, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { key: GenericMetadata.Experimenter_Group, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { key: GenericMetadata.Experiment_Name, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { key: GenericMetadata.Experiment_Date, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { key: GenericMetadata.Original_Folder_path, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { key: GenericMetadata.Instrument_Device_Name, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
    { key: GenericMetadata.Notes, value: `${Math.floor(Math.random() * Math.floor(1000))}` },
  ];

  // end

  @Input() fileItem: BrowserDataItem;

  // protected metadata: IGenericMetadata[];

  constructor(protected api: MetadataApiService) { }

  ngOnInit() {
    this.getGenericMetadata().then(data => this.metadata = data);
  }

  private async getGenericMetadata(): Promise<IGenericMetadata[]> {
    // const genericMetadata = await this.api.getPropertiesMeta('generic', this.fileItem.id).toPromise();

    // return genericMetadata;
    return this.metadata;
  }

}
