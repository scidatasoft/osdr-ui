import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesRoutingModule } from './features-routing.module';
import { FeaturesComputationComponent } from './features-computation/features-computation.component';
import { SharedModule } from '../../shared/shared.module';
import { PopoverModule } from 'ngx-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { FingerprntsModule } from 'app/shared/components/fingerprints/fingerprints.module';

@NgModule({
  imports: [CommonModule, FeaturesRoutingModule, SharedModule, PopoverModule, MatStepperModule, MatFormFieldModule, FingerprntsModule],
  declarations: [FeaturesComputationComponent]
})
export class FeaturesModule {}
