import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap';

import { SharedModule } from '../../shared.module';

import { ChemEditorComponent } from './chem-editor.component';

@NgModule({
  imports: [SharedModule, ModalModule],
  exports: [ChemEditorComponent],
  declarations: [ChemEditorComponent],
  providers: [],
})
export class ChemEditorModule {}
