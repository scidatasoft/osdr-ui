import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RecordViewRoutingModule } from './record-view-routing.module';
import { RecordViewComponent } from './record-view.component';

import { SharedModule } from 'app/shared/shared.module';

// Own resources
import { NotificationsModule } from 'app/shared/components/notifications/notifications.module';
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
import { BsModules } from 'app/modules/bs.module';
import { MdModules } from 'app/modules/md.module';

const routes: Routes = [
  {
    path: ':id',
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
  SidebarContentModule,
  OrganizeToolbarModule,
  OrganizeBrowserModule,
  InfoBoxModule,
  FileViewsModule,
  PropertiesEditorModule,
  PropertiesInfoBoxModule,
];

@NgModule({
  imports: [...modules, SharedModule, RecordViewRoutingModule, RouterModule.forChild(routes)],
  exports: [],
  declarations: [RecordViewComponent],
  providers: [SharingResolver, ShareElementGuard, SharingParentResolverService],
  schemas: [NO_ERRORS_SCHEMA]
})
export class RecordViewModule {}
