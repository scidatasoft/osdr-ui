import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeaturesComputationComponent } from './features-computation/features-computation.component';


const routes: Routes = [
  {
    path: '',
    component: FeaturesComputationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
