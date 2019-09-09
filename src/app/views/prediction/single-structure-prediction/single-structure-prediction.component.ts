import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox/typings/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject, zip } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

// own resources
import {
  DataSet,
  MLModel,
  ModelProperty,
  PredictionModelManager,
  PredictionReport,
  PredictionStatus,
  PredictionTask,
} from '../prediction.model';
import { SinglePredictionService } from '../single-prediction.service';

@Component({
  selector: 'dr-single-structure-prediction',
  templateUrl: './single-structure-prediction.component.html',
  styleUrls: ['./single-structure-prediction.component.scss'],
})
export class SingleStructurePredictionComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('ketcher', { static: true }) iframe: ElementRef;
  @ViewChild('stepper', { static: true }) stepper: MatStepper;

  @ViewChild('stepDrawStructure', { static: true }) stepDrawStructure: MatStep;
  @ViewChild('stepChooseProperty', { static: true }) stepChooseProperty: MatStep;
  @ViewChild('stepResult', { static: true }) stepResult: MatStep;

  predictions$: Observable<{ state: string }>;

  drawStepError = false;
  predictionStepError = false;

  private ketcherInstance: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  smilesFile: string;
  modelsData: PredictionModelManager = new PredictionModelManager();
  task: PredictionTask = null;
  predictionStatus = PredictionStatus;

  predictionsTasks: { data: { property: ModelProperty; model: MLModel[]; smiles: string }; task: PredictionTask }[] = [];

  report: PredictionReport = null;

  constructor(private predictionService: SinglePredictionService, private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit() {
    this.getMetadata();
  }

  getMetadata() {
    this.predictionService.getModels().subscribe(items => {
      this.modelsData.generatePredictionModel(items);
    });
  }

  ngAfterViewInit(): void {
    this.stepDrawStructure.completed = false;
    this.stepChooseProperty.completed = false;
  }

  frameLoaded() {
    if (!this.ketcherInstance) {
      const doc = this.iframe.nativeElement.contentWindow;
      this.ketcherInstance = doc.ketcher;
    }

    this.route.queryParamMap
      .pipe(
        map((params: ParamMap) => {
          return params.has('smiles') ? params.get('smiles') : '';
        }),
      )
      .subscribe(result => {
        if (result) {
          if (!this.ketcherInstance) {
            const doc = this.iframe.nativeElement.contentWindow;
            this.ketcherInstance = doc.ketcher;
          }

          if (this.ketcherInstance && result) {
            this.predictionService.getMolFile(result).subscribe(molFile => this.ketcherInstance.setMolecule(molFile));
          }
        }
      });
  }

  onGoToChoosePropertiesClick() {
    if (!this.ketcherInstance) {
      const doc = this.iframe.nativeElement.contentWindow;
      this.ketcherInstance = doc.ketcher;
    }

    const molFile = this.ketcherInstance.getMolfile();
    const smilesFile = this.ketcherInstance.getSmiles();

    if (smilesFile && smilesFile.length > 0) {
      this.smilesFile = smilesFile;
      this.stepDrawStructure.completed = true;
      this.stepper.next();
      this.drawStepError = false;
    } else {
      this.stepDrawStructure.completed = false;
      this.drawStepError = true;
    }
  }

  onGoDrawStrucureStep() {
    this.stepDrawStructure.completed = false;
    this.stepper.previous();
  }

  onGoToPredictionPage() {
    this.predictionsTasks = [];
    const propsArray: { property: ModelProperty; model: MLModel[] }[] = [];

    this.modelsData.getCheckedPropertiesGroupByProperty().map((item: { property: ModelProperty; model: MLModel[] }) => {
      propsArray.push(item);
    });

    this.report = new PredictionReport(propsArray);
    this.report.getRows().map(item => {
      const predictData = { property: item.property, model: item.models, smiles: this.smilesFile };
      const taskData = { data: predictData, task: new PredictionTask(predictData, this.destroy$, this.predictionService) };
      this.predictionsTasks.push(taskData);
      item['referTask'] = taskData;
    });

    const tasks = this.predictionsTasks.map(item => {
      return item.task.startTask().pipe(
        filter((taskItem: { status: PredictionStatus; data: any }) => {
          return (
            taskItem.status === PredictionStatus.finishOk ||
            taskItem.status === PredictionStatus.error ||
            taskItem.status === PredictionStatus.timeout
          );
        }),
      );
    });

    if (this.predictionsTasks.length > 0) {
      this.stepChooseProperty.completed = true;
      this.stepper.next();

      this.stepChooseProperty.editable = false;
      this.stepDrawStructure.editable = false;
      this.predictionStepError = false;

      this.predictions$ = zip(...tasks).pipe(
        takeUntil(this.destroy$),
        map((zipData: { status: PredictionStatus; data: any }[]) => {
          return { state: 'finish' };
        }),
      );
    } else {
      this.predictionStepError = true;
    }
  }

  getGroups(): string[] {
    let groups: string[] = [];
    groups = this.modelsData
      .getCheckedProperties()
      .reduce((accumulator: string[], current: { property: ModelProperty; model: MLModel }) => {
        if (accumulator.indexOf(current.property.propertyCategory) < 0) {
          accumulator.push(current.property.propertyCategory);
        }
        return accumulator;
      }, []);

    return groups.sort();
  }

  onResetStepper() {
    this.stepDrawStructure.editable = true;
    this.stepChooseProperty.editable = false;
    this.stepResult.editable = false;

    this.stepDrawStructure.completed = false;
    this.stepChooseProperty.completed = true;

    this.drawStepError = false;
    this.predictionStepError = false;

    this.stepper.reset();
    this.predictionsTasks = [];
    this.modelsData.clearSelection();

    // get metadata
    this.modelsData = new PredictionModelManager();
    this.getMetadata();

    this.report = null;
  }

  isKetcherEmpty(): boolean {
    if (!this.iframe || !this.iframe.nativeElement.contentWindow || !this.iframe.nativeElement.contentWindow.ketcher) {
      return false;
    }

    if (!this.ketcherInstance) {
      const doc = this.iframe.nativeElement.contentWindow;
      this.ketcherInstance = doc.ketcher;
    }

    const smilesFile = this.ketcherInstance.getSmiles();

    if (smilesFile && smilesFile.length > 0) {
      return true;
    }

    return false;
  }

  propsCount(group: { name: string; checked: boolean }): number {
    return Array.from(this.modelsData.propsTree.get(group).keys()).reduce((sum, current) => {
      return sum + Number(current.checked);
    }, 0);
  }

  modelsCount(group, property): number {
    return this.modelsData.propsTree
      .get(group)
      .get(property)
      .reduce((sum, current) => sum + 1, 0);
  }

  onGroupClick(event: MatCheckboxChange, group: { name: string; checked: boolean }) {
    group.checked = !group.checked;
    this.modelsData.selectGroup(group);
  }

  onPropsClick(event: MatCheckboxChange, group: { name: string; checked: boolean }, property: ModelProperty) {
    property.checked = !property.checked;
    this.modelsData.selectProperty(group, property);
  }

  onModelClick(event: MatCheckboxChange, group: { name: string; checked: boolean }, property: ModelProperty, model: MLModel) {
    model.checked = !model.checked;
    this.modelsData.modelClick(group, property, model);
  }

  getKeys(mapParam) {
    const array = Array.from(mapParam.keys());
    if (array.length > 0) {
      if (array[0] instanceof ModelProperty) {
        return Array.from(mapParam.keys()).sort((a: ModelProperty, b: ModelProperty) => {
          const nameA = a.propertyName.toUpperCase(); // ignore upper and lowercase
          const nameB = b.propertyName.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
      } else {
        return Array.from(mapParam.keys()).sort((a: { name: string; checked: false }, b: any) => {
          const nameA = a.name.toUpperCase(); // ignore upper and lowercase
          const nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
      }
    } else {
      return array;
    }
  }

  modelInclude(model: MLModel, row: any, column: string): boolean {
    return !!row[column].some(item => item.id === model.id);
  }

  targetModel(model: MLModel, row: any, column: string): MLModel {
    return row[column].find(item => item.id === model.id);
  }

  outsideDomain(value: { density: string; distance: string }): boolean {
    return value.density === 'Outside' && value.distance === 'Outside';
  }

  insideDomain(value: { density: string; distance: string }): boolean {
    return value.density === 'Inside' && value.distance === 'Inside';
  }

  fiftyFifty(value: { density: string; distance: string }): boolean {
    return this.outsideDomain(value) === false && this.insideDomain(value) === false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  convertToExp(value): { value: string; exp: string } {
    const newNumber: string = Number.parseFloat(value).toExponential(2);
    const digit: string = newNumber.slice(0, newNumber.indexOf('e'));
    let exp: string = newNumber.slice(newNumber.indexOf('e') + 1);

    if (exp.indexOf('+') >= 0) {
      exp = exp.slice(exp.indexOf('+') + 1);
    }

    if (Number.parseFloat(value) > 10000 || Number.parseFloat(value) < -10000 || Math.abs(Number.parseFloat(value)) < 0.00001) {
      return { value: digit, exp: exp };
    } else {
      return { value: digit, exp: null };
    }
  }

  getPropertyInfo(prop: ModelProperty): { property: ModelProperty; dataset: DataSet; models: MLModel[]; consensus: number }[] {
    const propsArray: { property: ModelProperty; model: MLModel[] }[] = [];

    this.modelsData.getPropertyAndModel(prop).map((item: { property: ModelProperty; model: MLModel[] }) => {
      propsArray.push(item);
    });

    return new PredictionReport(propsArray).getRows();
  }

  getPropDescription(prop: ModelProperty): string {
    let str = '';

    let modelsCount = 0;
    let datasetCount = 0;
    let rows: { property: ModelProperty; dataset: DataSet; models: MLModel[]; consensus: number }[] = [];

    const propsArray: { property: ModelProperty; model: MLModel[] }[] = [];

    this.modelsData.getPropertyAndModel(prop).map((item: { property: ModelProperty; model: MLModel[] }) => {
      propsArray.push(item);
    });

    rows = new PredictionReport(propsArray).getRows();

    rows.map(item => {
      datasetCount++;
      modelsCount += item.models.length;
    });

    if (modelsCount > 1) {
      str = `${modelsCount} models trained on ${datasetCount} `;
    } else {
      str = `${modelsCount} model trained on ${datasetCount} `;
    }

    if (datasetCount > 1) {
      str += 'datasets';
    } else {
      str += 'dataset';
    }

    return str;
  }

  onDetailsPreview(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }
}
