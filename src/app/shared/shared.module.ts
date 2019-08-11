import { NgModule } from '@angular/core';

import { CommonModulesList } from 'app/common-modules-list';

import { MdModules } from 'app/modules/md.module';
import { BsModules } from 'app/modules/bs.module';

import { StringTrimComponent } from './components/string-trim/string-trim.component';

import { PipesList } from './pipes-list';
import { DirectivesList } from './directives-list';
import { ContextMenuModule } from 'ngx-contextmenu';
import { FingerprintsComponent } from './components/fingerprints/fingerprints.component';
import { GenericMetadataPreviewComponent } from './components/generic-metadata-preview/generic-metadata-preview.component';
// import { ComponentsList } from './components-list';

const modules = [
  ...CommonModulesList,
  ...MdModules,
  ...BsModules,
];

const components = [
  StringTrimComponent,
  FingerprintsComponent,
  GenericMetadataPreviewComponent
];

@NgModule({
  imports: [...modules, ContextMenuModule.forRoot({
    autoFocus: true,
    // useBootstrap4: true,
  })],
  exports: [...modules, ContextMenuModule, ...PipesList, ...DirectivesList, ...components],
  declarations: [...PipesList, ...DirectivesList, ...components],
  providers: [],
})
export class SharedModule { }
