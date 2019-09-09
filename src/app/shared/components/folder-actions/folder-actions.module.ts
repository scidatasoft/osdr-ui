import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'app/shared/shared.module';

import { ValidationMessages } from '../../../core/services/validation/validation.service';
import { StringTrimModule } from '../string-trim/string-trim.module';

import { CreateFolderComponent } from './create-folder/create-folder.component';
import { DeleteFolderComponent } from './delete-folder/delete-folder.component';
import { MoveFolderComponent } from './move-folder/move-folder.component';
import { RenameFolderComponent } from './rename-folder/rename-folder.component';

const MatModules = [
  MatFormFieldModule,
  MatDialogModule,
  MatInputModule,
];

@NgModule({
  imports: [SharedModule, ...MatModules, StringTrimModule],
  exports: [CreateFolderComponent, DeleteFolderComponent, MoveFolderComponent, RenameFolderComponent],
  declarations: [CreateFolderComponent, DeleteFolderComponent, MoveFolderComponent, RenameFolderComponent],
  providers: [ValidationMessages],
})
export class FolderActionsModule { }
