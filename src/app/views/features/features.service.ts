import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { environment } from 'environments/environment';
import { map, catchError } from '../../../../node_modules/rxjs/operators';
import { Observable, throwError } from '../../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

  constructor(private http: HttpClient) { }

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      switch (error.status) {
        case 400:
          throwError('File size is too big or other validation errors');
          break;
        case 404:
          throwError('Features processing does not exists');
          break;
        case 402:
          throwError(`${error.error}`);
          break;
        default:
          throwError('Something bad happened; please try again later.');
          break;
      }
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  /**
   * POST /api/machinelearning/features.
   *
   * POST request that sends file in order to compute its Features.
   *
   ** 202 Accepted - Requests successfully accepted and GUID assigned to the calculation process generated.
   ** 400 Bad Request - File size is too big or other validation errors.
 */

  uploadFeaturesComputationSDF(formData): Observable<any> {
    return this.http
      .post(environment.apiUrl + '/machinelearning/features', formData, { observe: 'response' })
      .pipe(map((response => response)));
  }

  /**
   * GET /api/machinelearning/features/{id}/status.
   *
   * Retrieves STATUS of Features computation.
   *
   * Returns:
   ** 200 - if result file is ready
   ** 102 - if processing still running - https://www.restapitutorial.com/httpstatuscodes.html
   ** 404 - if processing with {id} doesn't exists
   ** 422 (Unprocessable Entity) - if calculation wasn't successful. Returns error message as a body.
   */

  getFeaturesComputationStatus(processingGuid: string): Observable<any> {
    return this.http
      .get(environment.apiUrl + '/machinelearning/features/' + processingGuid + '/status', { observe: 'response' })
      .pipe(
        map((response => response),
          catchError(err => this.handleError(err))
        ));
  }

  /**
   * GET /api/machinelearning/features/{id}.
   *
   * Retrieves FILE with results of Features computation.
   *
      ** "rowToStart" - indicates from which row should we start showing CSV preview
      ** "numRows" - indicates number of rows to retrieve for CSV preview
      ** "numColumns" - inidcates number of columns to retrive for CSV preview
   *
   * Returns file or status:
   ** 200 - if result file is ready
   ** 102 - if processing still running - https://www.restapitutorial.com/httpstatuscodes.html
   ** 404 - if processing with {id} doesn't exists
   ** 422 (Unprocessable Entity) - if calculation wasn't successful. Returns error message as a body.
   */

  getFeaturesComputationPreview(processingGuid: string, rowToStart: number, numRows: number, numColumns: number) {
    return `${environment.apiUrl}/machinelearning/features/${processingGuid}/preview?start=${rowToStart}&count=${numRows}&columns=${numColumns}`;
  }

  getDownloadUrl(processingGuid: string) {
    return `${environment.apiUrl}/machinelearning/features/${processingGuid}/download?content-disposition=attachment`;
  }
}
