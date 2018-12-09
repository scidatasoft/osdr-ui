import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesRoutingModule } from './features-routing.module';
import { FeaturesComputationComponent } from './features-computation/features-computation.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    SharedModule
  ],
  declarations: [FeaturesComputationComponent]
})
export class FeaturesModule { }
