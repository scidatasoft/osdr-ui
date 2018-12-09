import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { CreateFolderComponent } from './create-folder/create-folder.component';
import { DeleteFolderComponent } from './delete-folder/delete-folder.component';
import { MoveFolderComponent } from './move-folder/move-folder.component';
import { RenameFolderComponent } from './rename-folder/rename-folder.component';
import { ValidationMessages } from '../../../core/services/validation/validation.service';




@NgModule({
  imports: [...CommonModulesList, SharedModule],
  exports: [CreateFolderComponent, DeleteFolderComponent, MoveFolderComponent, RenameFolderComponent],
  declarations: [CreateFolderComponent, DeleteFolderComponent, MoveFolderComponent, RenameFolderComponent],
  providers: [ValidationMessages],
})
export class FolderActionsModule { }
