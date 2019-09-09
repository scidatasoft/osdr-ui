import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { FingerprntsModule } from 'app/shared/components/fingerprints/fingerprints.module';
import { PopoverModule } from 'ngx-bootstrap';

import { SharedModule } from '../../shared/shared.module';

import { FeaturesComputationComponent } from './features-computation/features-computation.component';
import { FeaturesRoutingModule } from './features-routing.module';

@NgModule({
  imports: [CommonModule, FeaturesRoutingModule, SharedModule, PopoverModule, MatStepperModule, MatFormFieldModule, FingerprntsModule],
  declarations: [FeaturesComputationComponent],
})
export class FeaturesModule {}
