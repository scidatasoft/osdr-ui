import { NgModule } from '@angular/core';
import { MatIconModule, MatRippleModule, MatTooltipModule, MatTreeModule } from '@angular/material';
import { SharedModule } from 'app/shared/shared.module';

import { CategoriesTreeComponent } from './categories-tree.component';
import { CategoriesService } from './categories.service';

const MatModules = [MatTreeModule, MatIconModule, MatRippleModule, MatTooltipModule];

@NgModule({
  declarations: [CategoriesTreeComponent],
  imports: [SharedModule, ...MatModules],
  exports: [CategoriesTreeComponent],
  providers: [CategoriesService],
})
export class CategoriesTreeModule {}
