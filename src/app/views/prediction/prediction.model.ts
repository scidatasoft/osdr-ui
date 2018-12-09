import { BehaviorSubject ,  Subject ,  Observable, EMPTY, interval } from 'rxjs';





import { SinglePredictionService } from './single-prediction.service';
import { takeUntil, timeout, catchError, filter } from 'rxjs/operators';

export interface DataSet {
  bucket: string;
  description: string;
  id: string;
  title: string;
}

export enum PredictionStatus {
  idle,
  executing,
  finishRequest,
  processing,
  finishOk,
  error,
  timeout
}


export class PredictionModelData {
  id: string;
  ownedBy: string;
  createdBy: string;
  createdDateTime: string;
  kFold: number;
  testDatasetSize: number;
  subSampleSize: number;
  className: string;
  fingerprints: {
    type: string,
    size: number,
    radius: number
  }[];
  property: {
    category: string; // Toxicity
    description: string; // Bioaccumulation factor description there
    name: string; // Bioaccumulation factor
    units: string; // unit
  };
  dataset: DataSet;
  modi: number; // 0.75,
  updatedBy: string;
  updatedDateTime: string;
  parentId: string;
  status: string; // Processed
  method: string; // naiveBayes
  displayMethodName: string;
  scaler: string; // Standard
  version: number;
  name: string; // Naive Bayes

  constructor(data?: any) {
    Object.assign(this, data);
  }

}


export class ModelProperty {
  propertyCategory: string; // Toxicity
  propertyName: string; // Bioaccumulation factor
  propertyUnits: string; // a unit
  propertyDescription: string; // Bioaccumulation factor description there
  checked = false;

  constructor(data?: { propertyCategory: string, propertyName: string, propertyUnits: string, propertyDescription: string }) {
    if (data) {
      this.propertyCategory = data.propertyCategory;
      this.propertyName = data.propertyName;
      this.propertyUnits = data.propertyUnits;
      this.propertyDescription = data.propertyDescription;
    }
  }
}


export class MLModel {
  id: string;
  ownedBy: string;
  createdBy: string;
  createdDateTime: string;
  kFold: number;
  testDatasetSize: number;
  subSampleSize: number;
  className: string;
  fingerprints: { type: string, size: number, radius: number }[];
  dataset: DataSet;
  modi: number; // 0.75,
  updatedBy: string;
  updatedDateTime: string;
  parentId: string;
  status: string; // Processed
  method: string; // naiveBayes
  displayMethodName: string;
  scaler: string; // Standard
  version: number;
  name: string; // Naive Bayes
  checked = false;

  constructor(data?: any) {
    if (data) {
      Object.assign(this, data);
    }

    if (this.dataset.title === null) {
      this.dataset.title = 'External dataset';
    }
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  getFingerPrints(): string {
    const fingerprints: string[] = [];

    this.fingerprints.map(
      (item: { type: string, size: number, radius: number }) => {
        let oneFp = item.type || '';

        if (item.radius) {
          oneFp += ` R${item.radius}`;
        }

        if (item.size) {
          oneFp += ` ${item.size}`;
        }

        fingerprints.push(oneFp.trim());
      }
    );

    return fingerprints.join(', ');
  }
}


export class PredictionModelManager {

  rawData: PredictionModelData[] = [];
  propsTree: Map<{ name: string, checked: boolean }, Map<ModelProperty, MLModel[]>> = new Map();

  constructor(rawData?: PredictionModelData[]) {
    if (rawData) {
      this.generatePredictionModel(rawData);
    }
  }

  public generatePredictionModel(rawData: PredictionModelData[]) {
    this.rawData = rawData;

    // generate props tree
    const groupsArray: string[] = [];
    rawData.map((item: PredictionModelData) => {
        if (groupsArray.indexOf(item.property.category) < 0) {
          groupsArray.push(item.property.category);
        }
      }
    );
    groupsArray.map(item => {
      this.propsTree.set({name: item, checked: false}, null);
    });

    Array.from(this.propsTree.keys()).map((groupKey: { name: string, checked: boolean }) => {

      const propMap: Map<ModelProperty, MLModel[]> = new Map<ModelProperty, MLModel[]>();

      rawData
        .filter(rawItem => rawItem.property.category === groupKey.name)
        .map((item: PredictionModelData) => {
          const propItem = new ModelProperty({
            propertyCategory: item.property.category,
            propertyName: item.property.name, propertyUnits: item.property.units, propertyDescription: item.property.description
          });
          const res = Array.from(propMap.keys()).find((findPropItem: ModelProperty) => findPropItem.propertyName === item.property.name);

          if (!res) {
            const propsArray: MLModel[] = rawData
              .filter(rawItem => rawItem.property.category === groupKey.name && rawItem.property.name === item.property.name)
              .map(propertyItem => {
                return new MLModel(propertyItem);
              });
            propMap.set(propItem, propsArray);
          }
        });

      this.propsTree.set(groupKey, propMap);
    });
  }

  selectGroup(group: { name: string, checked: boolean }) {
    const propMaps: Map<ModelProperty, MLModel[]> = this.propsTree.get(group);

    Array.from(propMaps.keys()).map((item: ModelProperty) => {
      item.checked = group.checked;
      this.propsTree.get(group).get(item).map((modelItem: MLModel) => modelItem.checked = group.checked);
    });
  }

  selectProperty(group: { name: string, checked: boolean }, property: ModelProperty) {
    const propMaps: Map<ModelProperty, MLModel[]> = this.propsTree.get(group);

    Array.from(propMaps.get(property)).map((item: MLModel) => {
      item.checked = property.checked;
    });

    if (!property.checked && this.isAllParentsClear(group)) {
      group.checked = false;
    } else if (property.checked) {
      group.checked = true;
    }
  }

  modelClick(group: { name: string, checked: boolean }, property: ModelProperty, model: MLModel) {
    if (model.checked) {
      property.checked = true;
      group.checked = true;
    } else {
      const propMaps: Map<ModelProperty, MLModel[]> = this.propsTree.get(group);
      const unselect = Array.from(propMaps.get(property)).every(item => !item.checked);

      if (unselect) {
        property.checked = false;
      }

      if (unselect && this.isAllParentsClear(group)) {
        group.checked = false;
      }
    }
  }

  isAllParentsClear(group: { name: string, checked: boolean }) {
    const propsResult = Array.from(this.propsTree.get(group).keys()).every(itemProps => {
      const modelResult = this.propsTree.get(group).get(itemProps).every(itemModel => itemModel.checked === false);
      return modelResult === true && itemProps.checked === false;
    });
    return propsResult;
  }

  getCheckedProperties(): { property: ModelProperty, model: MLModel }[] {
    const result: { property: ModelProperty, model: MLModel }[] = [];
    Array.from(this.propsTree.keys())
      .filter((groupItem: { name: string, checked: boolean }) => groupItem.checked === true)
      .map((groupKey: { name: string, checked: boolean }) => {

        Array.from(this.propsTree.get(groupKey).keys())
          .filter((propItem: ModelProperty) => propItem.checked === true)
          .map((propItem: ModelProperty) => {
            this.propsTree.get(groupKey).get(propItem)
              .filter((modelItem: MLModel) => modelItem.checked === true)
              .map((modelItem: MLModel) => {
                result.push({property: propItem, model: modelItem});
              });
          });

      });

    return result;
  }

  getCheckedPropertiesGroupByProperty(): { property: ModelProperty, model: MLModel[] }[] {
    const result: { property: ModelProperty, model: MLModel[] }[] = [];
    Array.from(this.propsTree.keys())
      .filter((groupItem: { name: string, checked: boolean }) => groupItem.checked === true)
      .map((groupKey: { name: string, checked: boolean }) => {

        Array.from(this.propsTree.get(groupKey).keys())
          .filter((propItem: ModelProperty) => propItem.checked === true)
          .map((propItem: ModelProperty) => {
            const newPropItem = {property: propItem, model: []};
            result.push(newPropItem);
            this.propsTree.get(groupKey).get(propItem)
              .filter((modelItem: MLModel) => modelItem.checked === true)
              .map((modelItem: MLModel) => {
                newPropItem.model.push(modelItem);
              });
          });

      });

    return result;
  }

  getPropertyAndModel(prop: ModelProperty): { property: ModelProperty, model: MLModel[] }[] {
    const result: { property: ModelProperty, model: MLModel[] }[] = [];
    Array.from(this.propsTree.keys())
      .map((groupKey: { name: string, checked: boolean }) => {

        Array.from(this.propsTree.get(groupKey).keys())
          .filter((propItem: ModelProperty) => propItem.propertyName === prop.propertyName)
          .map((propItem: ModelProperty) => {
            const newPropItem = {property: propItem, model: []};
            result.push(newPropItem);
            this.propsTree.get(groupKey).get(propItem)
              .map((modelItem: MLModel) => {
                newPropItem.model.push(modelItem);
              });
          });
      });
    return result;
  }

  clearSelection() {
    Array.from(this.propsTree.keys()).map(
      (groupItem: { name: string, checked: boolean }) => {
        groupItem.checked = false;
        this.selectGroup(groupItem);
      }
    );
  }

}


export class PredictionTask {
  taskTimeout = 5 * 60 * 1000;

  inputTaskData: { property: ModelProperty, model: MLModel[], smiles: string };
  finish$: Subject<boolean> = null;

  mainTask: Observable<any> = null;
  stream$: BehaviorSubject<{ status: PredictionStatus, data: any | PredictionResult }>
    = new BehaviorSubject({status: PredictionStatus.idle, data: null});

  countAttempts = 0;

  constructor(inputTaskData: { property: ModelProperty, model: MLModel[], smiles: string },
              finish$: Subject<boolean>,
              private predictionService: SinglePredictionService) {
    this.inputTaskData = inputTaskData;
    this.finish$ = finish$;
    this.initTask();
  }

  initTask() {
    // this.mainTask = Observable.timer(3000);
    this.mainTask = this.predictionService.predictProperties(this.inputTaskData);
    this.waitingTaskData();
  }

  startTask() {
    this.stream$.next({status: PredictionStatus.executing, data: null});
    this.mainTask.pipe(
      takeUntil(this.finish$),
      timeout(this.taskTimeout),
      catchError(error => {
        this.stream$.next({status: PredictionStatus.error, data: null});
        return EMPTY;
      })).subscribe(
      (data) => {
        this.stream$.next({status: PredictionStatus.finishRequest, data: data});
      }, (error) => {
        this.stream$.next({status: PredictionStatus.error, data: null});
      });
    return this.stream$;
  }

  waitingTaskData() {
    this.stream$.pipe(
      filter((eventData: { status: PredictionStatus, data: any }) => eventData.status === PredictionStatus.finishRequest))
      .subscribe(
        (eventData: { status: PredictionStatus, data: any }) => {
          this.stream$.next({status: PredictionStatus.processing, data: eventData.data});

          interval(500).pipe(
            takeUntil(this.finish$),
            takeUntil(this.stream$.pipe(filter(event => event.status === PredictionStatus.finishOk || event.status === PredictionStatus.error))),
            catchError(error => {
              this.stream$.next({status: PredictionStatus.error, data: null});
              return EMPTY;
            }))
            .subscribe(
              (timerData) => {
                if (this.countAttempts >= 400) {
                  this.stream$.next({status: PredictionStatus.error, data: timerData});
                }
                this.predictionService.getPredictionResult(eventData.data.predictionId)
                  .subscribe(
                    (outputData: PredictionResult) => {
                      if (outputData.status === 'COMPLETE') {
                        this.stream$.next({status: PredictionStatus.finishOk, data: outputData});
                      }
                    }
                  );
                this.countAttempts++;
              }, error => {
                console.error('timeout error.');
                this.stream$.next({status: PredictionStatus.error, data: null});
              }
            );
        }
      );
  }

  getResult() {
    return this.stream$.getValue();
  }

}

export class PredictionResult {
  predictionId: string;
  status: string;

  response: {
    predictionElapsedTime: number;
    models: {
      id: string;
      result: {
        value: number;
        error: number;
      };
      dataset: {
        description: string;
        title: string;
      };
      error: {
        error: string;
      }
    }[];
  };

}


export class PredictionReport {
  resultDataSet: any[] = [];
  reportColumns: { code: string, name: string }[] = [];
  originalData: { property: ModelProperty, model: MLModel[] }[] = [];
  models: MLModel[] = [];
  methods: Map<string, MLModel[]> = new Map<string, MLModel[]>();

  constructor(predictItems: { property: ModelProperty, model: MLModel[] }[]) {
    this.originalData = predictItems;
    this.buildReport();
  }

  initData() {
    this.resultDataSet = [];
    this.reportColumns = [];
    this.originalData = [];
    this.models = [];
    this.methods = new Map<string, MLModel[]>();
  }

  buildReport() {

    this.reportColumns = [
      // {code: 'state', name: 'State'},
      {code: 'property', name: 'Property'},
      {code: 'dataset', name: 'Dataset'},
      {code: 'consensus', name: 'Consensus'}
    ];

    const rows: { property: ModelProperty, dataset: DataSet, models: MLModel[], consensus: number }[] = [];

    this.originalData.map((item: { property: ModelProperty, model: MLModel[] }) => {

      this.models.push(...item.model);

      const aggregatedItem =
        item.model
          .reduce((result: { property: ModelProperty, dataset: DataSet, models: MLModel[], consensus: number }[], model: MLModel) => {
            const findDataSet = result.find(resultItem => resultItem.dataset.title === model.dataset.title);

            if (!findDataSet) {
              result.push({property: item.property, dataset: model.dataset, models: [model], consensus: null});
            } else {
              findDataSet.models.push(model);
            }

            return result;
          }, []);
      rows.push(...aggregatedItem);
    });

    this.models = this.models.reduce((result, current: MLModel) => {
      const findResult = result.find((item: MLModel) => item.id === current.id);
      if (!findResult) {
        result.push(current);
      }
      return result;
    }, []);

    this.models.map((item: MLModel) => {
      if (!this.methods.has(item.method)) {
        this.methods.set(item.method, [item]);
      } else {
        const arr = this.methods.get(item.method);
        arr.push(item);
        this.methods.set(item.method, arr);
      }
    });

    Array.from(this.methods.keys()).map(
      item => {
        const modelAndMethod = this.models.find((value: MLModel) => value.method === item);
        let methodName = item;
        if (modelAndMethod) {
          methodName = modelAndMethod.displayMethodName;
        }
        this.reportColumns.push({code: item, name: methodName});
      }
    );

    rows.map(item => {
        this.reportColumns.map(column => {
          if (!['property', 'dataset', 'consensus', 'state'].includes(column.code)) {
            item[column.code] = [];
          }
        });
        item.models.map((modelItem: MLModel) => {
          if (item[modelItem.method]) {
            item[modelItem.method].push(modelItem);
          }
        });

        // delete item.models;
      }
    );

    this.resultDataSet = rows;
  }

  getPropertyColumns(): string[] {
    return this.reportColumns.filter(item => !['property', 'dataset', 'consensus', 'state'].includes(item.code)).map(item => item.code);
  }

  getColumnByCode(columnName: string): string {
    return this.reportColumns.find(item => item.code === columnName).name;
  }

  getColumns(): string[] {
    return this.reportColumns.map(item => item.code);
  }

  getRows(group?: string): any[] {
    if (group) {
      return this.resultDataSet.filter(
        item => {
          return item.property.propertyCategory === group;
        }
      );
    } else {
      return this.resultDataSet;
    }
  }

  addTasks(predictionsTasks: { data: { property: ModelProperty; model: MLModel[]; smiles: string }; task: PredictionTask }[]) {
    this.resultDataSet.map(resultRow => {
        const targetTask = predictionsTasks.find(taskItem => {
          const propsEquals = (taskItem.data.property === resultRow.property);
          let modelInclude = false;
          modelInclude = taskItem.data.model.some(modelItem => {
            return resultRow.models.some(x => x.id === modelItem.id);
          });
          return propsEquals && modelInclude;
        });

        if (targetTask) {
          resultRow['referTask'] = targetTask;
        }
      }
    );
  }

}
