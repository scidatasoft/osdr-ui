import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// own resources
import { SingleStructurePredictionComponent } from './single-structure-prediction/single-structure-prediction.component';
import { SharedModule } from '../../shared/shared.module';
import { SinglePredictionService } from './single-prediction.service';
import { MatStepperModule, MatFormFieldModule, MatCheckboxModule, MatTableModule } from '@angular/material';
import { PopoverModule } from 'ngx-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: SingleStructurePredictionComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatStepperModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTableModule,
    PopoverModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SingleStructurePredictionComponent],
  providers: [SinglePredictionService]
})
export class PredictionModule {}
