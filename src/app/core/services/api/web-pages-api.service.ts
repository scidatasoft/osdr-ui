import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserDataItem } from 'app/shared/components/organize-browser/browser-types';
import { environment } from 'environments/environment';

@Injectable()
export class WebPagesApiService {
  constructor(public http: HttpClient) {}

  importWebPage(urlOfPage: string, folder: BrowserDataItem) {
    const data = { Uri: urlOfPage, parentId: folder.id };

    this.http.post(`${environment.apiUrl}/webpages/`, data).subscribe(
      outputData => {
        // console.log(outputData);
      },
      error => {
        console.log(error);
      },
    );
  }
}
