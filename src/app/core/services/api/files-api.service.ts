import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { NodesApiService } from 'app/core/services/api/nodes-api.service';
import { BrowserDataItem } from 'app/shared/components/organize-browser/browser-types';
import { PropertyType } from 'app/views/organize-view/organize-view.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FilesApiService {
  constructor(public http: HttpClient, private nodesApi: NodesApiService) {}

  getFieldsOfFile(fileId: string): Observable<any[]> {
    return this.http.get(`${environment.apiUrl}/entities/files/${fileId}?$projection=properties`).pipe(
      map((response: Response) => {
        const data: any = response;

        const fieldsArray: any[] = [];

        if (data.properties.fields) {
          for (const entry of data.properties.fields) {
            fieldsArray.push({ name: entry, value: entry });
          }
        }

        return fieldsArray;
      }),
    );
  }

  isFileNameValid(fileName: string) {
    return this.http.get(`api/properties.json?name=${fileName}`).pipe(
      map(res => {
        // TODO remove fake data
        return { fileExists: false };
      }),
    );
  }

  dataSetTransform(fileName: string, propertyList: { property: PropertyType; newName: string; mapValue: string }[]) {
    return this.http.get('api/properties.json').pipe(
      map(res => {
        // TODO remove fake data
        return { success: true };
      }),
    );
  }

  getProperties(fileId: string): Observable<PropertyType[]> {
    return this.http.get('api/properties.json').pipe(
      map(response => {
        const data: any = response;

        const propertyArray: PropertyType[] = [];

        for (const entry of data.propertiesCalculationResult.properties) {
          propertyArray.push(new PropertyType(entry.name, entry.value));
        }

        return propertyArray;
      }),
    );
  }

  getRecords(fileId: string, pageNumber: number, pageSize: number): Observable<any> {
    return this.nodesApi
      .getNodes(fileId, {
        pageNumber,
        pageSize,
        type: 'record',
      })
      .pipe(
        map(x => ({
          items: x.body as BrowserDataItem[],
          page: JSON.parse(x.headers.get('x-pagination')),
        })),
      );
  }

  getRecordsWithParams(fileId: string, params: Params): Observable<any> {
    // params['type'] = 'record';
    return this.nodesApi.getNodes(fileId, params).pipe(
      map(x => ({
        items: x.body as BrowserDataItem[],
        page: JSON.parse(x.headers.get('x-pagination')),
      })),
    );
  }
}
