import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RecordViewRoutingModule } from './record-view-routing.module';
import { RecordViewComponent } from './record-view.component';

import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

// Own resources
import { NotificationsModule } from 'app/shared/components/notifications/notifications.module';
import { FolderActionsModule } from 'app/shared/components/folder-actions/folder-actions.module';
import { ImportWebPageModule } from 'app/shared/components/import-web-page/import-web-page.module';
import { EntityCountsModule } from 'app/shared/components/entity-counts/entity-counts.module';
import { SidebarContentModule } from 'app/shared/components/sidebar-content/sidebar-content.module';
import { OrganizeToolbarModule } from 'app/shared/components/organize-toolbar/organize-toolbar.module';
import { OrganizeBrowserModule } from 'app/shared/components/organize-browser/organize-browser.module';
import { InfoBoxModule } from 'app/shared/components/info-box/info-box.module';
import { FileViewsModule } from 'app/shared/components/file-views/file-views.module';
import { PropertiesEditorModule } from 'app/shared/components/properties-editor/properties-editor.module';
import { PropertiesInfoBoxModule } from 'app/shared/components/properties-info-box/properties-info-box.module';
import { RouterModule, Routes } from '@angular/router';
import { SharingResolver } from '../../core/services/resolvers/sharing-resolver.service';
import { ShareElementGuard } from '../../core/services/guards/share-element.guard';
import { SharingParentResolverService } from '../../core/services/resolvers/sharing-parent-resolver.service';

const routes: Routes = [
  {
    path     : ':id',
    component: RecordViewComponent,
    canActivate: [ShareElementGuard],
    resolve: {
      share: SharingResolver,
      shareParent: SharingParentResolverService
    }
  }
];

const modules = [
  NotificationsModule,
  FolderActionsModule,
  ImportWebPageModule,
  EntityCountsModule,
  SidebarContentModule,
  OrganizeToolbarModule,
  OrganizeBrowserModule,
  InfoBoxModule,
  FileViewsModule,
  PropertiesEditorModule,
  PropertiesInfoBoxModule
];

@NgModule({
  imports: [...CommonModulesList,
    SharedModule,
  ...modules,
    RecordViewRoutingModule,
    RouterModule.forChild(routes)],
  exports: [],
  declarations: [RecordViewComponent],
  providers: [SharingResolver, ShareElementGuard, SharingParentResolverService],
  schemas: [NO_ERRORS_SCHEMA]
})
export class RecordViewModule { }
