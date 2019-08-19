import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { NotificationsModule } from 'app/shared/components/notifications/notifications.module';
import { Routes, RouterModule } from '@angular/router';
import { LabwizComponent } from './labwiz.component.';
import { MatCardModule } from '@angular/material';

const routes: Routes = [{ path: '', component: LabwizComponent }];

@NgModule({
  imports: [SharedModule, NotificationsModule, MatCardModule, RouterModule.forChild(routes)],
  exports: [LabwizComponent],
  declarations: [LabwizComponent],
  providers: []
})
export class LabWizModule {}
