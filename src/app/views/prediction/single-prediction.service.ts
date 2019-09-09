import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MLModel, ModelProperty, PredictionModelData, PredictionResult } from './prediction.model';

@Injectable()
export class SinglePredictionService {
  constructor(private http: HttpClient) {}

  getModels(): Observable<PredictionModelData[]> {
    const url = `${environment.apiUrl}/entities/models/public?$filter=Targets eq 'SSP'&PageNumber=1&PageSize=200`;
    return this.http.get<PredictionModelData[]>(url);
  }

  predictProperties(data: { property: ModelProperty; model: MLModel[]; smiles: string }): Observable<any> {
    const predictSettings = {
      PropertyName: data.property.propertyName,
      Structure: data.smiles,
      Format: 'SMILES',
      ModelIds: data.model.map(item => item.id),
    };
    return this.http.post(`${environment.apiUrl}/MachineLearning/predictions/structure`, predictSettings);
  }

  getPredictionResult(predictionId: string): Observable<PredictionResult> {
    const url = `${environment.apiUrl}/machinelearning/predictions/${predictionId}`;
    return this.http.get<PredictionResult>(url);
  }

  getMolFile(structure: string) {
    const url = environment.ketcher;
    const structureToSend = {
      struct: structure,
      output_format: 'chemical/x-mdl-molfile',
      options: {
        'smart-layout': true,
        'ignore-stereochemistry-errors': true,
        'mass-skip-error-on-pseudoatoms': false,
        'gross-formula-add-rsites': true,
      },
    };
    return this.http
      .post<{ format: string; struct: string }>(url, structureToSend)
      .pipe(map((item: { format: string; struct: string }) => item.struct));
  }
}
