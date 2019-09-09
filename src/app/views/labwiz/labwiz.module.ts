import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsModule } from 'app/shared/components/notifications/notifications.module';
import { SharedModule } from 'app/shared/shared.module';

import { LabwizComponent } from './labwiz.component.';

const routes: Routes = [{ path: '', component: LabwizComponent }];

@NgModule({
  imports: [SharedModule, NotificationsModule, MatCardModule, RouterModule.forChild(routes)],
  exports: [LabwizComponent],
  declarations: [LabwizComponent],
  providers: [],
})
export class LabWizModule {}
