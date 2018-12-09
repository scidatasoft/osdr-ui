import { Injectable } from '@angular/core';
import { MachineLearningTrainComponent } from './machine-learning-train/machine-learning-train.component';
import { MachineLearningPredictComponent } from './machine-learning-predict/machine-learning-predict.component';

@Injectable()
export class MachineLearningService {

  setActionViewComponent(component: any, data: any): any {
    return { component: component, inputs: data };
  }

  setMachineLearningTrainComponent(data: any): any {
    return this.setActionViewComponent(MachineLearningTrainComponent, data);
  }

  setMachineLearningPredictComponent(data: any): any {
    return this.setActionViewComponent(MachineLearningPredictComponent, data);
  }
}
