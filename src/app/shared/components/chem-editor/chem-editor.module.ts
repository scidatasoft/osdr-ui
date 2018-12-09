import { NgModule } from '@angular/core';
import { ChemEditorComponent } from './chem-editor.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [SharedModule],
  exports: [ChemEditorComponent],
  declarations: [ChemEditorComponent],
  providers: [],
})
export class ChemEditorModule { }
