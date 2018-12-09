import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { DatasetStepperComponent } from './dataset-stepper.component';
import { OrganizeBrowserModule } from '../organize-browser/organize-browser.module';

@NgModule({
  imports: [SharedModule, OrganizeBrowserModule],
  exports: [DatasetStepperComponent],
  declarations: [DatasetStepperComponent],
  providers: [],
})
export class DatasetStepperModule { }
