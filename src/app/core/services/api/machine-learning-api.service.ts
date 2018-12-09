import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class MachineLearningApiService {

  constructor(public http: HttpClient) {
  }

  createMLModel(data: any) {
    this.http.post(environment.apiUrl + '/machinelearning/models', data).subscribe(
      (outputData: Response) => {
      },
      (error) => {
        console.log(error);
      },
    );
  }


  predictProperties(predictSettings: any) {
    this.http.post(environment.apiUrl + '/machinelearning/predictions', predictSettings).subscribe(
      (outputData) => {
        console.log(outputData);
      },
      (error) => {
        console.log(error);
      },
    );
  }

  getModelOfFile(fileId?: string) {
    const mlMethods = [null,
      'NaiveBayes',
      'LogisticRegression',
      'DecisionTree',
      'RandomForest',
      'SupportVectorMachine',
      'NearestNeighborsСlassifier',
      'ExtremeGradientBoostingСlassifier',
      'NearestNeighborsRegressor',
      'ExtremeGradientBoostingRegressor',
      'DeepNeuralNetworks',
      'ElasticNet'];

    return this.http.get(environment.apiUrl
      + '/entities/models/me' + '?$filter=status in (\'Processed\', \'Loaded\')')
      .pipe(
        map((response) => {

        const data: any = response;
        const methodsList = mlMethods.map(x => x !== null ? x.toLowerCase() : 'None');
        for (const entry of data) {
          entry['method'].toLowerCase();
          entry['method'] = mlMethods[methodsList.indexOf(entry['method'].toLowerCase())];
        }
        return data;
      },
    ));
  }

  getModelListWithFilter(filter: string, pageNumber: number, pageSize: number): Observable<{items: any, totalCount: any}> {
    const requestUrl =
      `${environment.apiUrl}/entities/models/me?$filter=${filter}&PageNumber=${pageNumber}&PageSize=${pageSize}`;
      return this.http.get(requestUrl, { observe: 'response'}).pipe(map(x => {
        return { items: x.body, totalCount: JSON.parse(x.headers.get('x-pagination')).totalCount };
      }));
  }
}
