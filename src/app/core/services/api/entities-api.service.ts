import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BrowserDataItem } from 'app/shared/components/organize-browser/browser-types';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable()
export class EntitiesApiService {

  constructor(public http: HttpClient) { }

  renameEntity(entity: any, newName: string) {

    const data = [{
      op: 'replace',
      path: '/name',
      value: newName,
    }];

    const url = `${environment.apiUrl}/entities/${entity.type.toLowerCase()}s/${entity.id}?version=${entity.version}`;
    this.http.patch(url, data).subscribe(
      (dataOutput) => {
      },
      (error) => {
      },
    );
  }

  patchEntityPublicLink(entity: any, action: boolean) {

    const data = [{
      op: 'replace',
      path: '/Permissions/IsPublic',
      value: action
    }];

    const url = `${environment.apiUrl}/entities/${entity.type.toLowerCase()}s/${entity.id}?version=${entity.version}`;
    this.http.patch(url, data).subscribe(
      (dataOutput) => { },
      (error) => { },
    );
  }

  getFileEntity(fileId: string) {
    return this.http.get(environment.apiUrl
      + `/entities/files/${fileId}`).pipe(
        map(
          (response) => {
            return new BrowserDataItem(response as BrowserDataItem);
          },
        )
      );
  }

  getEntityMetadata(fileId: string, type: string) {
    return this.http.get(environment.apiUrl + `/entities/${type}s/${fileId}?$projection=metadata`).pipe(
      map(
        (response: Response) => {
          return response;
        },
      )
    );
  }

  getEntitiesProperties(fileId: string, type: string) {
    return this.http.get<any>(environment.apiUrl
      + `/entities/${type}/` + fileId);
  }

  patchRecordProperties(recordId: string, version: number, path: string, value: any[]) {
    const data = [{ op: 'replace', path, value }];
    return this.http.patch(environment.apiUrl + `/entities/records/${recordId}?version=${version}`, data).pipe(
      catchError(() => EMPTY)
    );
  }
}
