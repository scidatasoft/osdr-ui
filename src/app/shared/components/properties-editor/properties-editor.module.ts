import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';

import { PropertiesEditorComponent } from './properties-editor.component';
import { SwitchResponseComponent } from './responses/switch-response/switch-response.component';
import { TextResponseComponent } from './responses/text-response/text-response.component';

const components = [
  PropertiesEditorComponent,
  SwitchResponseComponent,
  TextResponseComponent
];

@NgModule({
  imports: [SharedModule],
  exports: [...components],
  declarations: [...components],
  providers: [],
  entryComponents: [PropertiesEditorComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class PropertiesEditorModule { }
