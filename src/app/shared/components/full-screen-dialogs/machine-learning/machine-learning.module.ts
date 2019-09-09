import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModulesList } from 'app/common-modules-list';
import { NotificationsModule } from 'app/shared/components/notifications/notifications.module';
import { OrganizeToolbarModule } from 'app/shared/components/organize-toolbar/organize-toolbar.module';
import { SharedModule } from 'app/shared/shared.module';

import { FingerprntsModule } from '../../fingerprints/fingerprints.module';
import { FolderActionsModule } from '../../folder-actions/folder-actions.module';

import { MachineLearningFactoryComponent } from './machine-learning-factory/machine-learning-factory.component';
import { MachineLearningPredictComponent } from './machine-learning-predict/machine-learning-predict.component';
import { MachineLearningTrainComponent } from './machine-learning-train/machine-learning-train.component';
import { MachineLearningService } from './machine-learning.service';

const components = [MachineLearningTrainComponent, MachineLearningPredictComponent, MachineLearningFactoryComponent];

const modules = [NotificationsModule, OrganizeToolbarModule, FolderActionsModule, FingerprntsModule];

const MatModules = [
  MatFormFieldModule,
  MatStepperModule,
  MatOptionModule,
  MatSelectModule,
  MatCheckboxModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  MatPaginatorModule,
  MatTableModule,
  MatTooltipModule,
];

@NgModule({
  imports: [SharedModule, ...modules, ...MatModules],
  exports: [...components],
  declarations: [...components],
  providers: [MachineLearningService],
})
export class MachineLearningModule {}
