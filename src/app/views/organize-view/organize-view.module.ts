import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { OrganizeViewRoutingModule } from './organize-view-routing.module';
import { OrganizeViewComponent } from './organize-view.component';

import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { ExportChemFilesService } from 'app/core/services/export-files/export-chem-files.service';


import { NotificationsModule } from 'app/shared/components/notifications/notifications.module';
import { FolderActionsModule } from 'app/shared/components/folder-actions/folder-actions.module';
import { ImportWebPageModule } from 'app/shared/components/import-web-page/import-web-page.module';
import { EntityCountsModule } from 'app/shared/components/entity-counts/entity-counts.module';
import { SidebarContentModule } from 'app/shared/components/sidebar-content/sidebar-content.module';
import { OrganizeToolbarModule } from 'app/shared/components/organize-toolbar/organize-toolbar.module';
import { OrganizeBrowserModule } from 'app/shared/components/organize-browser/organize-browser.module';
import { ExportDialogModule } from 'app/shared/components/export-dialog/export-dialog.module';
// import { MachineLearningService } from '../../shared/components/full-screen-dialogs/machine-learning/machine-learning.service';
import { ActionViewService } from '../../shared/components/full-screen-dialogs/action-view.service';
// import { MachineLearningModule } from '../../shared/components/full-screen-dialogs/machine-learning/machine-learning.module';

const modules = [
  NotificationsModule,
  FolderActionsModule,
  ImportWebPageModule,
  EntityCountsModule,
  SidebarContentModule,
  OrganizeToolbarModule,
  OrganizeBrowserModule,
  ExportDialogModule,
  // MachineLearningModule
];

@NgModule({
  imports: [...CommonModulesList,
    SharedModule,
  ...modules,
    OrganizeViewRoutingModule],
  exports: [],
  declarations: [OrganizeViewComponent],
  providers: [
    ActionViewService,
    // MachineLearningService
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class OrganizeViewModule { }
