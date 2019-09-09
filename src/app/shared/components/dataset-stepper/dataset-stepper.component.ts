import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntitiesApiService } from 'app/core/services/api/entities-api.service';
import { FilesApiService } from 'app/core/services/api/files-api.service';
import { FoldersApiService } from 'app/core/services/api/folders-api.service';
import { FilterField } from 'app/shared/components/filter-bar/filter-bar.model';
import { PropertyType } from 'app/views/organize-view/organize-view.model';
import { Observable } from 'rxjs';

import { BrowserData, BrowserOptions } from '../organize-browser/browser-types';

import { Stepper } from './dataset-stepper.model';

@Component({
  selector: 'dr-dataset-stepper',
  templateUrl: 'dataset-stepper.component.html',
  styleUrls: ['dataset-stepper.component.scss'],
})
export class DatasetStepperComponent extends BrowserOptions implements OnInit {

  errorDataSend = false;

  currentStep: Stepper = Stepper.step1;
  stepper = Stepper;

  propertyListOfFile: PropertyType[] = [];
  propertyListOfFileChanged: { property: PropertyType, newName: string, mapValue: string }[] = [];

  // Applied filter on recordset
  filterListFields: FilterField[] = [];

  // FormGroups
  propertyChangeNameFG_S1: FormGroup = null;
  propertyMapFG_S2: FormGroup = null;
  propertySaveFG_S3: FormGroup = null;

  // values for mapping
  mapValues = [
    { id: 1, name: 'Chemical Name' },
    { id: 2, name: 'CAS number' },
    { id: 3, name: 'InChI' },
    { id: 4, name: 'InChIKey' },
    { id: 5, name: 'SMILES' },
    { id: 6, name: 'Property value' },
    { id: 7, name: 'Property binary value' },
  ];

  constructor(
    private filesApi: FilesApiService,
    public foldersApi: FoldersApiService,
    public entitiesApi: EntitiesApiService,
    private route: ActivatedRoute,
    private router: Router) {
    super(foldersApi, entitiesApi);
  }

  itemDbClick(item: any): void {
  }

  itemClick(event: MouseEvent, item: any): void {
  }

  getItems(skip, take): Observable<BrowserData> {
    return Observable.create(observer => {
      this.route.params.subscribe(params => {
        const fileId = params.id;
        this.filesApi.getRecords(fileId, skip, take)
          .subscribe((x: BrowserData) => {
            x.items.map(z => z.name = z.id);
            observer.next(x);
          });
      });
    });
  }

  ngOnInit() {
    // FormGroup should be with values
    this.propertyChangeNameFG_S1 = new FormGroup({});
    this.propertyMapFG_S2 = new FormGroup({});
    this.propertySaveFG_S3 = new FormGroup({
      fileName: new FormControl(null, Validators.required, this.forbiddenFileName.bind(this)),
    });

    // Get file id
    const fileId = this.route.snapshot.params['id'];

    // Get query params
    for (const key in this.route.snapshot.queryParams) {
      if (this.route.snapshot.queryParams.hasOwnProperty(key)) {
        this.filterListFields.push(new FilterField(key, this.route.snapshot.queryParams[key]));
      }
    }

    const newThis = this;

    this.filesApi.getProperties(fileId).subscribe((data: any) => {
      this.propertyListOfFile = data;

      //  generate form for first step
      const formControls = {};
      for (const p of this.propertyListOfFile) {
        formControls[p.getKey()] = new FormControl(p.getName(), [Validators.required, this.duplicatePropertyName.bind(newThis)]);
      }
      this.propertyChangeNameFG_S1 = new FormGroup(formControls);
    });
  }

  nextStep() {
    if (this.currentStep < Stepper.step4) {
      this.currentStep = this.currentStep + 1;
    }
    this.errorDataSend = false;
  }

  prevStep() {
    if (this.currentStep > Stepper.step1) {
      this.currentStep = this.currentStep - 1;
    }
    this.errorDataSend = false;
  }

  onStepClick(step: Stepper) {
    if (this.currentStep > step) {
      this.currentStep = step;
    }
  }

  onSubmitFirstStep() {

    for (const property of this.propertyListOfFile) {
      const element = this.propertyListOfFileChanged.find((x: any) => {
        return x.property === property;
      });

      if (!element) {
        this.propertyListOfFileChanged.push(
          {
            property: property,
            newName: this.propertyChangeNameFG_S1.value[property.getKey()],
            mapValue: '',
          },
        );
      } else {
        element.newName = this.propertyChangeNameFG_S1.value[property.getKey()];
      }
    }

    // Generate form for second step
    if (Object.keys(this.propertyMapFG_S2.value).length === 0) {
      const formControls = {};
      for (const p of this.propertyListOfFile) {
        formControls[p.getKey()] = new FormControl(null, Validators.required);
      }
      this.propertyMapFG_S2 = new FormGroup(formControls);
    }
  }

  onSubmitSecondStep() {
    // insert values from FORM to array
    for (const property in this.propertyMapFG_S2.value) {
      if (!this.propertyMapFG_S2.value.hasOwnProperty(property)) {
        continue;
      }
      const element = this.propertyListOfFileChanged.find((x: any) => {
        return x.property.getKey() === property;
      });

      if (element) {
        element.mapValue = this.propertyMapFG_S2[property];
      }
    }
  }

  forbiddenFileName(control: FormControl): Promise<any> | Observable<any> {

    return new Promise<any>(
      resolve => {

        this.filesApi.isFileNameValid(control.value + '.ds').subscribe(
          data => {
            if (data.fileExists === false) {
              resolve(null);
            } else {
              resolve({ fileExists: true });
            }
          },
          error => {
            resolve({ fileExists: true });
          },
        );
      },
    );
  }

  duplicatePropertyName(control: FormControl): { [s: string]: boolean } {

    let count = 0;
    for (const index in this.propertyChangeNameFG_S1.controls) {
      if (!this.propertyChangeNameFG_S1.controls.hasOwnProperty(index)) {
        continue;
      }
      const attr = this.propertyChangeNameFG_S1.controls[index];
      if (attr.value === control.value) {
        count++;
      }
    }

    if (count > 1) {
      return { propertyNameDuplicated: true };
    } else {
      return null;
    }
  }

  onSubmitThirdStep() {
    // let r = this.router;
    this.filesApi.dataSetTransform(this.propertySaveFG_S3.value['fileName'] + '.ds', this.propertyListOfFileChanged).subscribe(
      (data) => {
        this.currentStep = Stepper.step4;
        setTimeout(() => {
          this.router.navigate(['/file', this.route.snapshot.params['id']]);
        }, 3000);
      },
      error => {
        this.errorDataSend = true;
        console.log(error);
      },
    );
  }

}
