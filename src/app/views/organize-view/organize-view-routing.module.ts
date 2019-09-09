import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrganizeViewComponent } from './organize-view.component';

const routes: Routes = [
  { path: '', component: OrganizeViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizeViewRoutingModule { }

export const routedComponents = [OrganizeViewComponent];
