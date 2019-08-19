import { NgModule } from '@angular/core';
import { ChemEditorComponent } from './chem-editor.component';
import { SharedModule } from '../../shared.module';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [SharedModule, ModalModule],
  exports: [ChemEditorComponent],
  declarations: [ChemEditorComponent],
  providers: []
})
export class ChemEditorModule {}
