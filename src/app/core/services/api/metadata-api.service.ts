import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from 'environments/environment';

@Injectable()
export class MetadataApiService {

  constructor(public http: HttpClient) {
  }

  getPropertiesMeta(name: string, fileId: string) {
    // return this.http.get('/api/infobox-properties.json').map(x => x.json());
    // return this.http.get<any>(`${environment.metadataUrl}/metadata/${name}?fileId=${fileId}`);
    return this.http.get<any>(`${environment.apiUrl}/entities/files/${fileId}/metadata/${name}`);
  }
}
