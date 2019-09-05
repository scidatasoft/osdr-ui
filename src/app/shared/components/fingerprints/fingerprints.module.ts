import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
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
