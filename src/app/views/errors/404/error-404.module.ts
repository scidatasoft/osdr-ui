import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { Error404Component } from './error-404.component';

const routes = [
  {
    path: '',
    component: Error404Component,
  },
];

@NgModule({
  declarations: [
    Error404Component,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
})

export class Error404Module {
}
