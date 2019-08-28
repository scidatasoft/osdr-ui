import {
  Component, OnInit, OnDestroy, Injector, HostListener, ViewChild, AfterViewInit
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { FilesApiService } from 'app/core/services/api/files-api.service';
import { AuthService } from 'app/core/services/auth/auth.service';
import { BrowserDataItem } from 'app/shared/components/organize-browser/browser-types';
import { MachineLearningApiService } from 'app/core/services/api/machine-learning-api.service';
import { MoveFolderComponent, MoveDialogType } from 'app/shared/components/folder-actions/move-folder/move-folder.component';
import { SignalrService } from 'app/core/services/signalr/signalr.service';
import { SignalREvent } from 'app/shared/components/notifications/events.model';
import { ActionViewService } from '../../action-view.service';
import {
  Scaler,
  TrainingParameter,
  ModelType,
  TrainingMode,
  TrainingMethod,
  TrainMachineLearningModel,
  Guid
} from '../machine-learning.model';
import { Subscription, Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { NodesApiService } from 'app/core/services/api/nodes-api.service';
import { FingerprintsComponent } from '../../../fingerprints/fingerprints.component';

@Component({
  selector: 'dr-machine-learning-train',
  templateUrl: './machine-learning-train.component.html',
  styleUrls: ['./machine-learning-train.component.scss']
})
export class MachineLearningTrainComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(FingerprintsComponent, { static: true }) fingerprints: FingerprintsComponent;

  currentItem: BrowserDataItem = new BrowserDataItem();
  parentItem: BrowserDataItem = new BrowserDataItem();

  viewInit = false;
  MLCreateModel: FormGroup;
  selectedFolder: BrowserDataItem = new BrowserDataItem();
  mockMetaData = [];

  // *****************************
  // To Be Retrieved From Back-End

  trainingModeList: TrainingMode[] = [
    {
      name: 'The system will optimize fingerprints and training parameters (takes longer to calculate)',
      optimize: true
    },
    {
      optimize: false,
      name: 'Enter training parameters manually',
    }
  ];

  trainingParameterList: TrainingParameter[] = [];

  modelType: ModelType[] =
    [
      { id: 1, value: 'Classification' },
      { id: 2, value: 'Regression' }
    ];

  optimizationList =
    [
      { key: 'default', name: 'Without optimization' },
      { key: 'parzen', name: 'With optimization' }
    ];

  scaleList: Scaler[] = [
    { id: 1, value: 'Standard', name: 'Standard' },
    { id: 2, value: 'MinMax', name: 'MinMax' },
    { id: 3, value: 'Robust', name: 'Robust' },
    { id: 4, value: null, name: 'None' }
  ];

  methodsList: TrainingMethod[] = [
    { key: 'naiveBayes', value: 'Naive Bayes', enum: 1, type: 'classification' },
    { key: 'linearRegression', value: 'Logistic Regression', enum: 2, type: 'classification' },
    { key: 'decisionTree', value: 'AdaBoost Decision Tree', enum: 3, type: 'classification' },
    { key: 'randomForestClassifier', value: 'Random Forest', enum: 4, type: 'classification' },
    { key: 'supportVectorMachineClassifier', value: 'Support Vector Machine', enum: 5, type: 'classification' },
    { key: 'nearestNeighborsClassifier', value: 'Nearest Neighbors', enum: 7, type: 'classification' },
    { key: 'extremeGradientBoostingClassifier', value: 'Extreme Gradient Boosting', enum: 8, type: 'classification' },
    { key: 'nearestNeighborsRegressor', value: 'Nearest Neighbors', enum: 9, type: 'regression' },
    { key: 'extremeGradientBoostingRegressor', value: 'Extreme Gradient Boosting', enum: 10, type: 'regression' },
    { key: 'elasticNet', value: 'Elastic Net', enum: 11, type: 'regression' },
    { key: 'dnnRegressor', value: 'Deep Neural Networks', enum: 12, type: 'regression' },
    { key: 'dnnClassifier', value: 'Deep Neural Networks', enum: 12, type: 'classification' },
    { key: 'supportVectorMachineRegressor', value: 'Support Vector Machine', enum: 13, type: 'regression' },
  ];

  dnnLayerList = [
    1, 2, 3, 4
  ];

  dnnNeuronList = [
    32, 64, 128, 256, 512
  ];

  // *****************************
  selectedModelType: string = null;
  formPayLoad = {};
  parameters: TrainMachineLearningModel = new TrainMachineLearningModel();

  trainingModeValueChange: Subscription;
  modelTypeValueChange: Subscription;

  filePayload: { sourceBlobId: string, sourceBucket: string, parentId?: string, userId: string, sourceFileName: string };

  updateSubject: Subject<any> = new Subject();
  update: Observable<any> = this.updateSubject.asObservable();

  options = { update: this.update };
  enableExtraOptions: boolean;

  get modelTrainForm(): FormArray | null { return this.MLCreateModel.get('modelTrainForm') as FormArray; }
  get methodsFormArray(): FormArray { return this.MLCreateModel.get('modelTrainForm.2.methods') as FormArray; }
  get fingerprintsArray(): FormArray { return this.MLCreateModel.get('modelTrainForm.1.fingerprints') as FormArray; }
  get firstStep(): FormGroup { return this.modelTrainForm.controls[0] as FormGroup; }
  get secondStep(): FormGroup { return this.modelTrainForm.controls[1] as FormGroup; }
  get thirdStep(): FormGroup { return this.modelTrainForm.controls[2] as FormGroup; }


  get display(): boolean {
    return this.actionViewService.isActionViewActive;
  }

  set display(value: boolean) {
    this.actionViewService.isActionViewActive = value;
  }

  constructor(
    private signalr: SignalrService,
    private filesApi: FilesApiService,
    private auth: AuthService,
    private fb: FormBuilder,
    private mlApi: MachineLearningApiService,
    private injector: Injector,
    private actionViewService: ActionViewService,
    private dialog: MatDialog,
    private nodesApi: NodesApiService
  ) {
    this.currentItem = this.injector.get('selectedItems');
    this.parentItem = this.injector.get('parentItem');
    this.mockMetaData.push(
      this.modelType,
      this.scaleList
    );
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    if (this.display) {
      if (targetElement.closest('.nav-item')) {
        this.display = false;
      }
    }
  }

  ngOnInit() {
    this.sortDialogOption();
    this.getCurrentFileData();
    this.initMLModelForm();
    this.getClassNameList();
    this.onTrainingModeChange();
    this.onModelTypeChange();
    this.updateTrainingMode();
    this.signalr.organizeUpdate.subscribe((x: SignalREvent) => {
      this.updateSubject.next(x);
    });
    this.viewInit = this.actionViewService.isActionViewActive;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadPreviousTrainingData();
    });
  }

  ngOnDestroy() {
    this.modelTypeValueChange.unsubscribe();
    this.trainingModeValueChange.unsubscribe();
    this.actionViewService.isActionViewActive = false;
  }

  initMLModelForm() {
    return this.MLCreateModel = this.fb.group({
      modelTrainForm: this.fb.array([
        this.fb.group({
          folderName: [null, Validators.required],
          modelType: [null, Validators.required],
          targetFolderId: [this.auth.user.profile.sub]
        }),
        this.initDataSetProperties(),
        this.fb.group({
          methods: this.initMethods(),
        })
      ])
    });
  }

  initDataSetProperties() {
    return this.fb.group({
      trainingParameter: [null, [Validators.required]],
      optimize: true,
      fingerprints: this.fb.array([]),
      subSampleSize: [1, Validators.compose([Validators.min(0.2), Validators.max(1), Validators.required])],
      testDataSize: [0.2, Validators.compose([Validators.min(0), Validators.max(0.5), Validators.required])],
      kFold: [2, Validators.compose([Validators.min(2), Validators.max(10), Validators.required])],
      scaler: ['MinMax'],
      hyperParameters: this.fb.group({
        numberOfIterations: [100, Validators.compose([Validators.min(10), Validators.max(1000), Validators.required])],
        optimizationMethod: ['default', Validators.required]
      })
    });
  }

  initMethods() {
    return this.fb.array([]);
  }

  sortDialogOption() {
    this.mockMetaData.forEach(x => this.sortArrOfObj(x));
  }

  sortArrOfObj(arr) {
    arr.sort((a, b) => {
      return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);
    });
  }

  getClassNameList(): void {
    this.filesApi.getFieldsOfFile(this.currentItem.id).subscribe((data: any) => {
      this.trainingParameterList = data;
    });
  }

  getCurrentFileData() {
    this.filePayload = {
      sourceBlobId: this.currentItem.blob.id,
      sourceBucket: this.currentItem.blob.bucket,
      sourceFileName: this.currentItem.name,
      userId: this.auth.user.profile.sub
    };
  }

  generatePayLoadData(): void {
    this.MLCreateModel.value.modelTrainForm.forEach(el => {
      if (el.hasOwnProperty('trainingParameter') && el.trainingParameter && this.secondStep.controls.optimize.value) {
        this.formPayLoad = Object.assign({}, this.formPayLoad, { trainingParameter: el.trainingParameter });
      } else {
        this.formPayLoad = Object.assign({}, this.formPayLoad, el, { optimize: this.secondStep.controls.optimize.value });
        Object.assign(this.MLCreateModel.value.modelTrainForm[1].fingerprints, this.fingerprints.fingerprintList.value);
      }
    });
    this.formPayLoad['fingerprints'] = this.fingerprints.fingerprintList.value;
    this.formPayLoad = Object.assign({}, this.formPayLoad, this.filePayload);
    this.formPayLoad['methods'] = this.methodsList.filter(x => x.type === this.selectedModelType)
      .filter(y => this.formPayLoad['methods'].indexOf(y.key) !== -1).map(res => res.key);
    delete this.formPayLoad['folderName'];
  }

  storeFormValue(): void {
    localStorage.setItem(`mlTrain${this.selectedModelType.replace(/^\w/, c => c.toUpperCase())}`,
      JSON.stringify(this.modelTrainForm.value));
    localStorage.setItem('mlTrainModelType', this.selectedModelType);
  }

  parseJsonData(data) {
    return JSON.parse(data);
  }

  getLocalStorageData() {
    const lsModelType = localStorage.getItem('mlTrainModelType');
    const lsClassification = localStorage.getItem('mlTrainClassification');
    const lsRegression = localStorage.getItem('mlTrainRegression');

    const data = {
      modelType: lsModelType,
      classification: {
        key: 'classification',
        value: JSON.parse(lsClassification),
      },
      regression: {
        key: 'regression',
        value: JSON.parse(lsRegression),
      }
    };
    return data;
  }

  isFolderExist(id: Guid): void {
    this.auth.user.profile.sub === id ?
      this.parameters.folderName = 'DRAFTS' :
      this.nodesApi.getRawNode(id).subscribe(() => { }, error => this.parameters.folderName = 'DRAFTS');
  }

  setMethods(methods): void {
    this.removeDuplicateMethods(methods).forEach(x => this.methodsFormArray.push(new FormControl(x)));
  }

  removeDuplicateMethods(methods) {
    return this.methodsList.filter(x => x.type === this.selectedModelType)
      .filter(item => methods.indexOf(item.key) !== -1).map(x => x.key);
  }

  isStored(checkboxValue: string): boolean {
    const methodControl = this.modelTrainForm as FormArray;
    const methods = methodControl.controls[2].value.methods;
    return methods.includes(checkboxValue);
  }

  loadPreviousTrainingData(): void {
    const data = this.getLocalStorageData();
    if (data && data.modelType && data[data.modelType].value) {
      data[data.modelType].value.forEach(x => Object.assign(this.parameters, x));
      this.removeDuplicateMethods(this.parameters.methods);
      this.isFolderExist(this.parameters.targetFolderId);
      this.modelTrainForm.patchValue(this.parameters.getFormValue(this.parameters));
      this.parameters.fingerprints.forEach((fp, i) => i !== (this.parameters.fingerprints.length - 1) ?
      this.fingerprints.addFingerprints() : null);
      this.fingerprints.fingerprintForm.controls['fingerprints'].patchValue(this.parameters.fingerprints);
      (this.parameters.methods.indexOf('dnnRegressor') >= 0 || this.parameters.methods.indexOf('dnnClassifier') >= 0) ?
        this.extendDnnParameters() :
        this.removeExtendedDnnParameters();
      this.setMethods(this.parameters.methods);
    }
  }

  updateTrainingMode(): void {
    const formGroup = this.secondStep;
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control = formGroup.controls[key];
        if (
          key !== 'trainingParameter' &&
          key !== 'optimize' &&
          this.secondStep.controls.optimize.value
        ) {
          control.disable({ emitEvent: false });
          control.setErrors(null);
        } else {
          control.enable({ emitEvent: false });
          formGroup.updateValueAndValidity({ emitEvent: false });
        }
      }
    }
  }

  onModelTypeChange(): void {
    this.modelTypeValueChange = this.firstStep.controls.modelType.valueChanges.subscribe(x => {
      if (x != null) {
        this.selectedModelType = x.toLowerCase();
      }
    });
  }

  extendDnnParameters() {
    this.enableExtraOptions = true;
    this.thirdStep.addControl('dnnLayers', new FormControl(3, Validators.required));
    this.thirdStep.addControl('dnnNeurons', new FormControl(256, Validators.required));
  }

  removeExtendedDnnParameters() {
    this.enableExtraOptions = false;
    this.thirdStep.removeControl('dnnLayers');
    this.thirdStep.removeControl('dnnNeurons');
  }

  onMethodChange(key: string, isChecked: boolean): void {
    if (isChecked) {
      this.methodsFormArray.push(new FormControl(key));
      if ((key === 'dnnRegression' || key === 'dnnClassifier') && !this.enableExtraOptions) {
        this.extendDnnParameters();
      }
    } else {
      if ((key === 'dnnRegression' || key === 'dnnClassifier') && this.enableExtraOptions) {
        this.removeExtendedDnnParameters();
      }
      const index = this.methodsFormArray.controls.findIndex(x => x.value === key);
      this.methodsFormArray.removeAt(index);
    }
  }


  onTrainingModeChange(): void {
    this.trainingModeValueChange = this.secondStep.controls.optimize.valueChanges.subscribe(x => {
      this.updateTrainingMode();
    });
  }

  openMoveItemDialog(): void {
    const dialogRef = this.dialog.open(MoveFolderComponent, {
      width: '500px',
      data: {
        startFolder: this.parentItem,
        movedItems: [this.currentItem],
        options: this.options,
        submitButtonText: 'Select folder',
        dialogType: MoveDialogType.FolderPicker,
        viewInit: this.viewInit
      }
    });
    dialogRef.componentInstance.moveFolderEvent.subscribe((e: { toFolder: BrowserDataItem, folder: BrowserDataItem }) => {
      this.selectedFolder = e.toFolder;
      this.firstStep.controls.folderName.patchValue(e.toFolder.name === '' ? 'DRAFTS' : e.toFolder.name);
      this.firstStep.controls.targetFolderId.patchValue(this.selectedFolder.id);
      dialogRef.close();
    });
  }

  onSubmit(): void {
    this.generatePayLoadData();
    this.storeFormValue();
    this.mlApi.createMLModel(this.formPayLoad);
    this.display = false;
  }

  onClose(): void {
    this.display = false;
  }

}
