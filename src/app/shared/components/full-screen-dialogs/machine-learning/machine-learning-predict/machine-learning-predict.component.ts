import { Component, OnInit, OnDestroy, ViewChild, Injector, HostListener } from '@angular/core';
import { MoveFolderComponent, MoveDialogType } from 'app/shared/components/folder-actions/move-folder/move-folder.component';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { BrowserDataItem } from 'app/shared/components/organize-browser/browser-types';
import { Subject, Observable, Subscription, merge, of } from 'rxjs';
import { MachineLearningApiService } from 'app/core/services/api/machine-learning-api.service';
import { AuthService } from 'app/core/services/auth/auth.service';
import { SignalREvent } from 'app/shared/components/notifications/events.model';
import { SignalrService } from 'app/core/services/signalr/signalr.service';
import { ValidateFolderName } from 'app/core/services/validation/validation.service';
import { ActionViewService } from 'app/shared/components/full-screen-dialogs/action-view.service';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { UsersApiService } from 'app/core/services/api/users-api.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'dr-machine-learning-predict',
  templateUrl: './machine-learning-predict.component.html',
  styleUrls: ['./machine-learning-predict.component.scss']
})
export class MachineLearningPredictComponent implements OnInit, OnDestroy {

  MLPredictProperties: FormGroup;
  viewInit = false;

  displayedColumns: string[] = ['select', 'modelName', 'datasetTitle', 'trainedDate', 'createdBy'];
  dataSource = null;
  data = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  selection = new SelectionModel(false, []);

  currentItem: BrowserDataItem = new BrowserDataItem();
  parentItem: BrowserDataItem = new BrowserDataItem();
  selectedFolder: BrowserDataItem;

  modelList: { id: string, name: string }[] = [];
  propertyList: any[] = [];
  currentModelBlob: any;
  datasetFileName: any;
  hyperParameters = [
    { key: 'Method', value: null },
    { key: 'Class', value: null },
    { key: 'K-Fold', value: null },
    { key: 'Scaler', value: null },
    { key: 'Sub Sample Size', value: null },
    { key: 'Dataset Size', value: null }
  ];
  fingerprintsList: any[] = [];

  updateSubject: Subject<any> = new Subject();
  update: Observable<any> = this.updateSubject.asObservable();

  options = { update: this.update };

  public subscriptions: Subscription[] = [];

  get modelTrainForm(): AbstractControl | null { return this.MLPredictProperties.get('predictModel'); }

  get display(): boolean {
    return this.actionViewService.isActionViewActive;
  }

  set display(value: boolean) {
    this.actionViewService.isActionViewActive = value;
  }
  constructor(
    private signalr: SignalrService,
    private mlApi: MachineLearningApiService,
    private usersApi: UsersApiService,
    private auth: AuthService,
    private fb: FormBuilder,
    private injector: Injector,
    private actionViewService: ActionViewService,
    private dialog: MatDialog
  ) {
    this.currentItem = this.injector.get('selectedItems');
    this.parentItem = this.injector.get('parentItem');
    this.datasetFileName = this.currentItem.name && this.currentItem.name.substring(0, this.currentItem.name.lastIndexOf('.'));
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
    this.initMLModelForm();
    this.loadData();
    this.signalr.organizeUpdate.subscribe((x: SignalREvent) => {
      this.updateSubject.next(x);
    });
    this.viewInit = this.actionViewService.isActionViewActive;
    this.subscriptions.push(
      this.selection.onChange.subscribe(
        item => {
          if (!item.added[0]) { this.modelTrainForm.setErrors({ noFileSelected: true }); } else { this.modelTrainForm.setErrors(null); }
          const model = item.added[0];
          if (model) {
            this.currentModelBlob = model['blob'];
            this.hyperParameters = [
              { key: 'Method', value: model['method'] },
              { key: 'Class', value: model['className'] },
              { key: 'K-Fold', value: model['kFold'] },
              { key: 'Scaler', value: model['scaler'] },
              { key: 'Sub Sample Size', value: model['subSampleSize'] },
              { key: 'Dataset Size', value: model['testDatasetSize'] }
            ];
            if (model && model.hasOwnProperty('fingerprints')) {
              this.fingerprintsList = [];
              model['fingerprints'].forEach(x => {
                this.fingerprintsList.push(x);
              });
            }
          }
        }
      )
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
    this.actionViewService.isActionViewActive = false;
  }

  loadData() {

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const filter = 'status in (\'Processed\', \'Loaded\')';
          return this.mlApi.getModelListWithFilter(
            filter,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize ? this.paginator.pageSize : 5
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.totalCount;
          data.items
            .map(item => this.usersApi.getUserInfo(item.ownedBy)
              .subscribe(x => item.modelOwnerInfo = x));
          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return of([]);
        })
      ).subscribe(data => {
        this.data = data;
        this.dataSource = new MatTableDataSource(this.data);
      });
  }

  // initPropertyValues(): void {
  //   if (this.modelList.length > 0) {
  //     this.MLPredictProperties.get('model').setValue(this.modelList[0].id);
  //   }
  // }

  initMLModelForm() {
    return this.MLPredictProperties = this.fb.group({
      // model: ['', Validators.required],
      folderName: ['', Validators.compose([Validators.required, ValidateFolderName])],
      // sourceFile: [{ value: this.currentItem.name, disabled: true }, Validators.required],
    });
  }


  onSubmit(): void {
    const data = {
      targetFolderId: this.selectedFolder.id,
      DatasetBlobId: this.currentItem.blob.id,
      DatasetBucket: this.currentItem.blob.bucket,
      ModelBlobId: this.currentModelBlob.id,
      ModelBucket: 'ml_modeler',
      UserId: this.auth.user.profile.sub,
    };
    this.mlApi.predictProperties(data);
    this.display = false;
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

      this.MLPredictProperties.get('folderName').patchValue(e.toFolder.name === '' ? 'DRAFTS' : e.toFolder.name);
      dialogRef.close();
    });
  }

  onClose() {
    this.display = false;
  }
}
