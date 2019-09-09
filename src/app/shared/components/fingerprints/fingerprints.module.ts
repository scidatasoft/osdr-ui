import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';

import { FingerprintsComponent } from './fingerprints.component';

const MatModules = [
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  ReactiveFormsModule,
  MatIconModule,
  MatTooltipModule,
];

@NgModule({
  imports: [SharedModule, ...MatModules],
  exports: [FingerprintsComponent],
  declarations: [FingerprintsComponent],
  providers: [],
})
export class FingerprntsModule {}
