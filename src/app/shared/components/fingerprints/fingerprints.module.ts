import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FingerprintsComponent } from './fingerprints.component';
import { ReactiveFormsModule } from '@angular/forms';

const MatModules = [
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  ReactiveFormsModule,
  MatIconModule,
  MatTooltipModule
];

@NgModule({
  imports: [SharedModule, ...MatModules],
  exports: [FingerprintsComponent],
  declarations: [FingerprintsComponent],
  providers: []
})
export class FingerprntsModule {}
