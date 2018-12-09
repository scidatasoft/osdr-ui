import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordViewComponent } from './record-view.component';

const routes: Routes = [
  { path: '', component: RecordViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordViewRoutingModule { }

export const routedComponents = [RecordViewComponent];
