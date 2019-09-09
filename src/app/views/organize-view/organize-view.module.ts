import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { ExportChemFilesService } from 'app/core/services/export-files/export-chem-files.service';
import { EntityCountsModule } from 'app/shared/components/entity-counts/entity-counts.module';
import { ExportDialogModule } from 'app/shared/components/export-dialog/export-dialog.module';
import { FolderActionsModule } from 'app/shared/components/folder-actions/folder-actions.module';
import { ImportWebPageModule } from 'app/shared/components/import-web-page/import-web-page.module';
import { NotificationsModule } from 'app/shared/components/notifications/notifications.module';
import { OrganizeBrowserModule } from 'app/shared/components/organize-browser/organize-browser.module';
import { OrganizeToolbarModule } from 'app/shared/components/organize-toolbar/organize-toolbar.module';
import { SidebarContentModule } from 'app/shared/components/sidebar-content/sidebar-content.module';
import { SharedModule } from 'app/shared/shared.module';

// import { MachineLearningService } from '../../shared/components/full-screen-dialogs/machine-learning/machine-learning.service';
import { ActionViewService } from '../../shared/components/full-screen-dialogs/action-view.service';

import { OrganizeViewRoutingModule } from './organize-view-routing.module';
import { OrganizeViewComponent } from './organize-view.component';
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
  imports: [...modules, SharedModule, OrganizeViewRoutingModule],
  exports: [],
  declarations: [OrganizeViewComponent],
  providers: [
    ActionViewService,
    // MachineLearningService
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class OrganizeViewModule {}
