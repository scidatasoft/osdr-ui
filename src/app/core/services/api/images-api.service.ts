import { Injectable } from '@angular/core';
import {BrowserDataItem, ImageInfo, NodeType} from 'app/shared/components/organize-browser/browser-types';
import { environment } from 'environments/environment';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class ImagesApiService {

  constructor(public auth: AuthService) {
  }

  getImageUrl(imageObj: ImageInfo): string {
    if (this.auth.user && this.auth.user.access_token) {
      return environment.imagingUrl + `/images/${imageObj.id}/?access_token=${this.auth.user.access_token}`;
    } else {
      return '#';
    }
  }

  getImageUrlNew(imageObj: ImageInfo, item: BrowserDataItem): string {
    // TODO to change it
    let type = 'UNKNOWN';
    if (item.type && item.getNodeType() === NodeType.Record) {
      type = 'records';
    } else if (item.type && item.getNodeType() === NodeType.Model) {
      type = 'models';
    } else {
      type = 'files';
    }

    const url = `${environment.apiUrl}/entities/${type}/${item.id}/images/${imageObj.id}`;

    if (this.auth.user && this.auth.user.access_token) {
      return `${url}/?access_token=${this.auth.user.access_token}`;
    } else {
      return url;
    }
  }
}
