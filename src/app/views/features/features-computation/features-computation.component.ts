import { Component, OnInit, ViewChild } from '@angular/core';
import { FeaturesService } from '../features.service';
import { ComputationStatus } from '../features.model';
import { interval } from '../../../../../node_modules/rxjs';
import { takeUntil, flatMap } from '../../../../../node_modules/rxjs/operators';
import * as Papa from 'papaparse';
import { Subject } from '../../../../../node_modules/rxjs';
import { MatStepper } from '../../../../../node_modules/@angular/material';
import { FingerprintsComponent, Origin } from '../../../shared/components/fingerprints/fingerprints.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'dr-features-computation',
  templateUrl: './features-computation.component.html',
  styleUrls: ['./features-computation.component.scss']
})
export class FeaturesComputationComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('fileInput') fileInput: HTMLInputElement;
  @ViewChild(FingerprintsComponent) fingerprints: FingerprintsComponent;

  pollingFinished$: Subject<ComputationStatus> = new Subject();
  fileData: any = null;

  status: string = ComputationStatus.ABSENT;
  errorMessage: string = null;

  fileProcessingGuid = null;

  firstStepFG: FormGroup;
  secondStepFG: FormGroup;

  rowToStart = 1;
  numRows = 10;
  numColumns = 20;

  fileItem: File = null;
  fileExtension: string = null;
  isWrongExtension = true;

  fileIsToBig = true;
  fileSize: string | number = null;
  dataArrayFromFile: any = [];

  constructor(
    private featuresService: FeaturesService,
  ) { }

  ngOnInit() { }

  onFileDrop(e): void {
    if (['cif', 'sdf'].indexOf(this.getFileExtension(e.dataTransfer.files[0].name)) >= 0) {
      this.fileItem = e.dataTransfer.files[0];
      this.fileExtension = this.getFileExtension(this.fileItem.name);
      this.fileSize = this.formatBytes(this.fileItem.size, 0, true);
      this.fileItem.size > 10485760 ? this.fileIsToBig = true : this.fileIsToBig = false;
      this.isWrongExtension = false;
    } else {
      this.isWrongExtension = true;
    }
  }

  onFileChange(e): void {
    if (['cif', 'sdf'].indexOf(this.getFileExtension((e.target.files[0] as File).name)) >= 0) {
      this.fileItem = e.target.files[0] as File;
      this.fileExtension = this.getFileExtension(this.fileItem.name);
      this.fileSize = this.formatBytes(this.fileItem.size, 0, true);
      this.fileItem.size > 10485760 ? this.fileIsToBig = true : this.fileIsToBig = false;
      this.isWrongExtension = false;
    } else {
      this.isWrongExtension = true;
    }
  }

  getFingerprintsByFileType(): Origin | null {
    if (this.fileExtension && this.fileExtension.includes('sdf')) {
      return Origin.FvcSDF;
    } else if (this.fileExtension && this.fileExtension.includes('cif')) {
      return Origin.FvcCIF;
    } else {
      return null;
    }
  }

  getFileExtension(fileName: string): string {
    if (fileName.indexOf('.') >= 0) {
      return fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
    }
    return '';
  }

  uploadFile(file: File): void {
    this.status = ComputationStatus.PROCESSING;
    this.dataArrayFromFile = [];
    const formData = new FormData();
    const fingerprints = JSON.stringify(this.fingerprints.fingerprintList.value);
    formData.append('file', file);
    formData.append('fingerprints', fingerprints);
    this.featuresService.uploadFeaturesComputationSDF(formData).subscribe(res => {
      this.fileProcessingGuid = res.body.id;
      if (res.status === 201) {
        this.getFileStatus();
      } else if (res.status === 400) {
        this.status = ComputationStatus.FAILED;
        this.errorMessage = res.body;
        throw new Error('File size is too big or other validation errors');
      }
    });
  }

  getFileStatus(): void {
    interval(2000).pipe(
      flatMap(() => this.featuresService.getFeaturesComputationStatus(this.fileProcessingGuid)),
      takeUntil(this.pollingFinished$)
    ).subscribe(data => {
      if (!data) { return; }
      const status = data.status;
      switch (status) {
        case 200:
          this.renderCSV();
          this.status = ComputationStatus.SUCCESS;
          this.fileData = data.body;
          this.pollingFinished$.next(ComputationStatus.SUCCESS);
          // file is ready to be downloaded / displayed
          break;
        case 202:
          this.status = ComputationStatus.PROCESSING;
          // file is still processing
          break;
        default:
          break;
      }
    }, error => {
      switch (error.status) {
        case 400:
          this.status = ComputationStatus.FAILED;
          this.errorMessage = error.error;
          this.pollingFinished$.next(ComputationStatus.FAILED);
          break;
        case 404:
          this.status = ComputationStatus.ABSENT;
          this.pollingFinished$.next(ComputationStatus.ABSENT);
          break;
        default:
          break;
      }
    });
  }

  renderCSV(): void {
    const blobUrl = this.featuresService
      .getFeaturesComputationPreview(this.fileProcessingGuid, this.rowToStart, this.numRows, this.numColumns);
    // const blobUrl = 'api/classic_ML.csv';
    Papa.parse(blobUrl, {
      download: true,
      complete: (results) => {
        this.status = ComputationStatus.RENDERING;
        this.dataArrayFromFile = results.data;
        for (const i in this.dataArrayFromFile) {
          if (this.dataArrayFromFile[i].length === 1) {
            this.dataArrayFromFile.splice(i, i);
          }
        }
        this.status = ComputationStatus.RENDERED;
      }
    });
  }

  getTableBody() {
    return this.dataArrayFromFile.slice(1);
  }

  getTableHeader() {
    return this.dataArrayFromFile[0];
  }

  downloadResults(): void {
    const url = this.featuresService.getDownloadUrl(this.fileProcessingGuid);
    window.open(url, '_self');
  }

  resetForm(): void {
    this.fileExtension = null;
    this.fingerprints.fingerprintList.reset();
    this.isWrongExtension = true;
    this.fileIsToBig = true;
    this.fileSize = null;
    this.fileItem = null;
    this.pollingFinished$ = null;
    this.fileData = null;
    this.status = ComputationStatus.ABSENT;
    this.fingerprints.loadFingerprints();
    this.stepper.reset();
  }

  formatBytes(bytes, decimals, index?) {
    if (bytes === 0) { return 0; }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    // with index - KB, MB, GB etc...
    // return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    if (index) { return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]; }
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  }
}
