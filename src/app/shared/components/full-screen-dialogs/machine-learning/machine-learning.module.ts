import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';
import { MachineLearningTrainComponent } from './machine-learning-train/machine-learning-train.component';
import { MachineLearningPredictComponent } from './machine-learning-predict/machine-learning-predict.component';
import { MachineLearningFactoryComponent } from './machine-learning-factory/machine-learning-factory.component';
import { MachineLearningService } from './machine-learning.service';
import { NotificationsModule } from 'app/shared/components/notifications/notifications.module';
import { OrganizeToolbarModule } from 'app/shared/components/organize-toolbar/organize-toolbar.module';
import { FolderActionsModule } from '../../folder-actions/folder-actions.module';

const components = [
  MachineLearningTrainComponent,
  MachineLearningPredictComponent,
  MachineLearningFactoryComponent,
];

const modules = [
  NotificationsModule,
  OrganizeToolbarModule,
  FolderActionsModule
];

@NgModule({
  imports: [SharedModule, ...CommonModulesList, ...modules],
  exports: [...components],
  declarations: [...components],
  providers: [MachineLearningService],
})
export class MachineLearningModule { }
