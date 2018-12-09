import {
  BsModalService,
  ComponentLoaderFactory,
  PositioningService,
  BsDropdownConfig
} from 'ngx-bootstrap';


import { AuthService } from './services/auth/auth.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { AuthProfileGuardGuard } from './services/auth/auth-profile-guard.guard';
import { ExportChemFilesService } from './services/export-files/export-chem-files.service';
import { NotificationsService } from './services/notifications/notifications.service';
import { PageTitleService } from './services/page-title/page-title.service';

// api services
import { BlobsApiService } from './services/api/blobs-api.service';
import { EntitiesApiService } from './services/api/entities-api.service';
import { FilesApiService } from './services/api/files-api.service';
import { FoldersApiService } from './services/api/folders-api.service';
import { ImagesApiService } from './services/api/images-api.service';
import { MachineLearningApiService } from './services/api/machine-learning-api.service';
import { NodesApiService } from './services/api/nodes-api.service';
import { SearchResultsApiService } from './services/api/search-results-api.service';
import { UsersApiService } from './services/api/users-api.service';
import { WebPagesApiService } from './services/api/web-pages-api.service';
import { MetadataApiService } from './services/api/metadata-api.service';
import { NotificationsApiService } from './services/api/notifications-api.service';
// components
import { NavbarModule } from './navbar/navbar.module';
import { SignalrService } from 'app/core/services/signalr/signalr.service';
// shared service
import { InfoBoxFactoryService } from 'app/shared/components/info-box/info-box-factory.service';
import { SidebarContentService } from 'app/shared/components/sidebar-content/sidebar-content.service';
import { MachineLearningService } from '../shared/components/full-screen-dialogs/machine-learning/machine-learning.service';
import { ActionViewService } from '../shared/components/full-screen-dialogs/action-view.service';
import { FingerprintsService } from './services/fingerprints/fingerprints.service';


export const ServicesList = [
  // BsModalService, ComponentLoaderFactory, PositioningService,
  AuthService,
  AuthGuardService,
  AuthProfileGuardGuard,
  NotificationsService,
  PageTitleService,
  BlobsApiService,
  EntitiesApiService,
  FilesApiService,
  FoldersApiService,
  ImagesApiService,
  MachineLearningApiService,
  NodesApiService,
  SearchResultsApiService,
  UsersApiService,
  WebPagesApiService,
  MetadataApiService,
  SignalrService,
  SidebarContentService,
  InfoBoxFactoryService,
  NotificationsApiService,
  ExportChemFilesService,
  ActionViewService,
  FingerprintsService
];
