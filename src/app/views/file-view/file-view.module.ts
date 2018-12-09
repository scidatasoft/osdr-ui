import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { FileViewComponent } from './file-view.component';


import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';


import { NotificationsModule } from 'app/shared/components/notifications/notifications.module';
import { FolderActionsModule } from 'app/shared/components/folder-actions/folder-actions.module';
import { ImportWebPageModule } from 'app/shared/components/import-web-page/import-web-page.module';
import { EntityCountsModule } from 'app/shared/components/entity-counts/entity-counts.module';
import { SidebarContentModule } from 'app/shared/components/sidebar-content/sidebar-content.module';
import { OrganizeToolbarModule } from 'app/shared/components/organize-toolbar/organize-toolbar.module';
import { OrganizeBrowserModule } from 'app/shared/components/organize-browser/organize-browser.module';
import { FileViewsModule } from 'app/shared/components/file-views/file-views.module';
import { SharedLinksModule } from 'app/shared/components/shared-links/shared-links.module';
import { ExportDialogModule } from 'app/shared/components/export-dialog/export-dialog.module';
import { BrowserDataFileService } from '../../core/services/browser-services/browser-data-file.service';
import { BrowserDataBaseService } from '../../core/services/browser-services/browser-data-base.service';
import { PaginatorManagerService } from '../../core/services/browser-services/paginator-manager.service';
import { SharingResolver } from '../../core/services/resolvers/sharing-resolver.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { BrowserDataSharedFileServiceService } from '../../core/services/browser-services/browser-data-shared-file-service.service';
import { RouterModule, Routes } from '@angular/router';
import { ShareElementGuard } from '../../core/services/guards/share-element.guard';
import { SharingParentResolverService } from '../../core/services/resolvers/sharing-parent-resolver.service';

export let dataServiceFactory = (auth: AuthService,
  sharedProvider: BrowserDataSharedFileServiceService,
  dataFileService: BrowserDataFileService) => {
  if (auth.user && auth.user.profile) {
    return dataFileService;
  } else {
    return sharedProvider;
  }
};

const routes: Routes = [
  {
    path: ':id',
    component: FileViewComponent,
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
  FileViewsModule,
  SharedLinksModule,
  ExportDialogModule
];

@NgModule({
  imports: [
    ...CommonModulesList,
    SharedModule,
    ...modules,
    RouterModule.forChild(routes)],
  exports: [FileViewComponent],
  declarations: [FileViewComponent],
  providers: [
    PaginatorManagerService,
    {
      provide: BrowserDataBaseService,
      useFactory: dataServiceFactory,
      deps: [AuthService, BrowserDataSharedFileServiceService, BrowserDataFileService]
    },
    BrowserDataSharedFileServiceService,
    BrowserDataFileService,
    SharingResolver, SharingParentResolverService,
    ShareElementGuard
  ],
  schemas: [NO_ERRORS_SCHEMA]

})
export class FileViewModule { }
