import { NgModule } from '@angular/core';
import { MatIconModule, MatRippleModule, MatTreeModule } from '@angular/material';
import { SharedModule } from 'app/shared/shared.module';

import { CategoriesTreeComponent } from './categories-tree.component';

const MatModules = [MatTreeModule, MatIconModule, MatRippleModule];

@NgModule({
  declarations: [CategoriesTreeComponent],
  imports: [SharedModule, ...MatModules],
  exports: [CategoriesTreeComponent],
})
export class CategoriesTreeModule {}
