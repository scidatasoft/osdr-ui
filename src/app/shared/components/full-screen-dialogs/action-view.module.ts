import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';
import { ActionViewService } from './action-view.service';
// import { MachineLearningModule } from './machine-learning/machine-learning.module';

const modules = [
  // MachineLearningModule
];

@NgModule({
  imports: [SharedModule, ...modules],
  exports: [],
  declarations: [],
  providers: [ActionViewService],
})
export class ActionViewModule { }
