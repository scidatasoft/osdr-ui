import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormArray, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { FingerprintsService } from '../../../core/services/fingerprints/fingerprints.service';

@Component({
  selector: 'dr-fingerprints',
  templateUrl: './fingerprints.component.html',
  styleUrls: ['./fingerprints.component.scss']
})
export class FingerprintsComponent implements OnInit {

  @Input() fingerprintType: Origin = null;

  fingerprintSizeList: number[] = [128, 256, 512, 1024, 2048];

  fingerprintRadiusList: number[] = [2, 3, 4];

  fingerprintForm: FormGroup = null;
  maxFingerprints: number;
  settings: MlSettings;

  get fingerprintList(): FormArray { return this.fingerprintForm.controls.fingerprints as FormArray; }

  set fingerprintList(fingerprint) { this.fingerprintForm.controls.fingerprints.setValue(fingerprint); }

  constructor(api: FingerprintsService) {
    api.getFingerprints().subscribe((data: MlSettings) => {
      this.settings = data;
    });
  }

  ngOnInit() {
    this.loadFingerprints();
    this.validateOnTypeChange();
    this.validateDuplications();
    this.validateOnDataChange();
  }

  loadFingerprints() {
    this.fingerprintForm = new FormGroup({
      fingerprints: new FormArray([
        this.initFingerprints()
      ])
    });
  }

  initFingerprints(): FormGroup {
    return new FormGroup({
      type: new FormControl('', Validators.required)
    });
  }

  addFingerprints(): void {
    this.fingerprintList.push(this.initFingerprints());
    this.validateOnTypeChange();
    this.validateDuplications();
  }

  removeFingerprints(id): void {
    this.fingerprintList.removeAt(id);
  }

  getFingerprintsControls(): AbstractControl[] {
    return this.fingerprintList.controls;
  }

  getFingerprintsByType(origin: Origin | null): Fingerprint[] {
    if (origin && this.settings) {
      if (origin === Origin.FvcSDF) {
        this.maxFingerprints = 4;
      } else if (origin === Origin.FvcCIF) {
        this.maxFingerprints = 3;
      }
      return this.settings.fingerprints.fingerprintList.filter(fp => fp.origin.indexOf(origin) >= 0 ? fp : null);
    }
  }

  hasDuplicate(id): Boolean {
    const formGroup = this.fingerprintList.controls[id] as FormGroup;
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const element = formGroup.controls[key];
        return element.hasError('duplicate');
      }
    }
  }

  validateOnTypeChange(): void {
    this.fingerprintList.controls.forEach((formGroup: FormGroup) => {
      formGroup.controls.type.valueChanges.subscribe(val => {
        if (formGroup && formGroup.controls.type) {
          this.settings.fingerprints.fingerprintList.forEach(fingerprint => {
            if (fingerprint.key === val) {
              if (fingerprint.parameters != null && fingerprint.parameters.length > 0) {
                fingerprint.parameters.forEach(parameter => {
                  if ((['radius', 'size']).indexOf(parameter) >= 0) {
                    formGroup.addControl(parameter, new FormControl('', Validators.required));
                  } else {
                    formGroup.removeControl(parameter);
                  }
                });
              } else if (fingerprint && fingerprint.parameters == null) {
                Object.keys(formGroup.controls).forEach(key => key !== 'type' ? formGroup.removeControl(key) : null);
              }
            }
          });
        }
      });
    });
  }

  validateOnDataChange(): void {
    this.fingerprintList.valueChanges.subscribe(() => this.validateDuplications());
  }

  validateDuplications(): void {
    this.fingerprintList.value.filter(
      (thing, index, self) => {
        if (index !== self.findIndex((t) => (
          t.type === thing.type
          && t.size === thing.size
          && t.radius === thing.radius))) {
          this.setDuplicateError(index);
        } else if
        (index === self.findIndex((t) => (
          t.type === thing.type
          && t.size === thing.size
          && t.radius === thing.radius))) {
          this.removeDuplicateError(index);
        }
      }
    );
  }

  setDuplicateError(index): void {
    const duplicateGroup = this.fingerprintList.controls[index] as FormGroup;
    for (const key in duplicateGroup.controls) {
      if (duplicateGroup.controls.hasOwnProperty(key)) {
        const formControl = duplicateGroup.controls[key];
        formControl.setErrors({ 'duplicate': true });
      }
    }
  }

  removeDuplicateError(index): void {
    const validGroup = this.fingerprintList.controls[index] as FormGroup;
    for (const key in validGroup.controls) {
      if (validGroup.controls.hasOwnProperty(key)) {
        const formControl = validGroup.controls[key];
        if (formControl.errors && formControl.errors.hasOwnProperty('duplicate') && formControl.value) {
          formControl.setErrors(null);
        }
      }
    }
  }
}

/**
 * TODO:
 ** Complete MLSettings class
 ** Move to 'machine-learning.model.ts'
 ** Refactor '-//-.model.ts' (transfer settings to file)
 ** Move file 'fingerprints.json' to ML directory
 */

export class MlSettings {
  fingerprints: Fingerprints;
  featureSettings: FeatureSettings;
}

export interface FeatureSettings {
  featuresCalculation: FeaturesCalculation;
  machineLearning: MachineLearning;
}

export interface FeaturesCalculation {
  maxFingerprints: FeaturesCalculationMaxFingerprints;
}

export interface FeaturesCalculationMaxFingerprints {
  fvcSDF: number;
  fvcCIF: number;
  default: number;
}

export interface MachineLearning {
  maxFingerprints: MachineLearningMaxFingerprints;
  datasetParameters: DatasetParameters;
}

export interface DatasetParameters {
  modelType: string[];
  optimizationList: OptimizationList[];
  scaleList: ScaleList[];
  methodsList: MethodsList[];
  dnnLayerList: number[];
  dnnNeuronList: number[];
}

export interface MethodsList {
  key: string;
  value: string;
  enum: number;
  type: Type;
}

export enum Type {
  Classification = 'classification',
  Regression = 'regression',
}

export interface OptimizationList {
  key: string;
  name: string;
}

export interface ScaleList {
  value: null | string;
  name: string;
}

export interface MachineLearningMaxFingerprints {
  default: number;
}

export interface Fingerprints {
  fingerprintList: Fingerprint[];
  fingerprintRadiusList: number[];
  fingerprintSizeList: number[];
}

export interface Fingerprint {
  key: string;
  value: string;
  parameters: Parameter[] | null;
  description: null | string;
  origin: Origin[];
}

export enum Origin {
  FvcCIF = 'fvcCIF',
  FvcSDF = 'fvcSDF',
  MlTrain = 'mlTrain'
}

export enum Parameter {
  Radius = 'radius',
  Size = 'size',
}
