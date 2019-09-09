import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { SharedLinksComponent } from './shared-links.component';

@NgModule({
  imports: [SharedModule, MatInputModule, MatDialogModule, MatButtonModule],
  exports: [SharedLinksComponent],
  declarations: [SharedLinksComponent],
  providers: [],
  entryComponents: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SharedLinksModule { }
