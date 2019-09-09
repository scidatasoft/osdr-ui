import { Injectable } from '@angular/core';

import { MachineLearningPredictComponent } from './machine-learning-predict/machine-learning-predict.component';
import { MachineLearningTrainComponent } from './machine-learning-train/machine-learning-train.component';

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
