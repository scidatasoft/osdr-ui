import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fingerprint } from 'app/shared/components/fingerprints/fingerprints.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FingerprintsService {

  constructor(private http: HttpClient) { }

  private _fingerprints: Fingerprint[] = null;

  get fingerprintList(): Fingerprint[] {
    return this._fingerprints;
  }

  set fingerprintList(fp: Fingerprint[]) {
    this._fingerprints = fp;
  }

  public getFingerprints(): Observable<any> {
    return this.http.get('api/fingerprints.json');
  }

}
