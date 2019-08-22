import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Own resources
import { AuthService } from '../auth/auth.service';
import { environment } from 'environments/environment';
import { BrowserDataItem } from 'app/shared/components/organize-browser/browser-types';
import { NotificationExportMessage } from 'app/shared/components/notifications/notifications.model';



@Injectable()
export class BlobsApiService {

  constructor(private auth: AuthService, private http: HttpClient) {
  }

  getBlobUrl(fileInfo: BrowserDataItem, download?: boolean): string {
    if (fileInfo && fileInfo.blob) {
      let contentDisposition = '';
      if (download && download === true) {
        contentDisposition = `content-disposition=attachment`;
      }
      const type = fileInfo.type + 's';

      const url = `${environment.apiUrl}/entities/${type.toLocaleLowerCase()}/${fileInfo.id}/blobs/${fileInfo.blob.id}?${contentDisposition}`;
      if (this.auth.user && this.auth.user.access_token) {
        return `${url}${contentDisposition.length > 0 ? '&' : ''}access_token=${this.auth.user.access_token}`;
      } else {
        return url;
      }
    } else {
      return '';
    }
  }

  getExportFileUrl(fileInfo: NotificationExportMessage, download?: boolean): string {
    if (fileInfo) {
      const tokenParameter = `/?access_token=${this.auth.user.access_token}`;
      let contentDisposition = '';
      if (download && download === true) {
        contentDisposition = `&content-disposition=attachment`;
      }

      return `
      ${environment.blobStorageApiUrl}/blobs/${fileInfo.ExportBucket}/${fileInfo.ExportBlobId}${tokenParameter}${contentDisposition}`;
    } else {
      return '';
    }
  }

  uploadFiles(folderId: string, formData: FormData) {
    return this.http.post(environment.blobStorageApiUrl + '/blobs/' + this.auth.user.profile.sub, formData);
  }

  getOfficeFileUrlOld(fileInfo: { pdf: { bucket: any; blobId: any; }; }, download?: boolean): string {
    if (fileInfo && fileInfo.pdf) {
      const tokenParameter = `/?access_token=${this.auth.user.access_token}`;

      return `${environment.blobStorageApiUrl}/blobs/${fileInfo.pdf.bucket}/${fileInfo.pdf.blobId}${tokenParameter}`;
    } else {
      return '';
    }
  }

  getOfficeFileUrl(fileInfo: BrowserDataItem, download?: boolean): string {
    if (fileInfo && fileInfo.pdf) {
      const type = 'files';

      const url = `${environment.apiUrl}/entities/${type}/${fileInfo.id}/blobs/${fileInfo.pdf.blobId}`;
      if (this.auth.user && this.auth.user.access_token) {
        return `${url}/?access_token=${this.auth.user.access_token}`;
      } else {
        return url;
      }
    } else {
      return '';
    }
  }

  getInfo(bucket: any, blobId: any) {
    return this.http.get(environment.blobStorageApiUrl + `/blobs/${bucket}/${blobId}/info`);
  }
}
