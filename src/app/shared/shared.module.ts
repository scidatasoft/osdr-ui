import { NgModule } from '@angular/core';
import { CommonModulesList } from 'app/common-modules-list';
import { ContextMenuModule } from 'ngx-contextmenu';

import { DirectivesList } from './directives-list';
import { PipesList } from './pipes-list';

const modules = [
  ...CommonModulesList,
];

@NgModule({
  imports: [...modules, ContextMenuModule.forRoot({
    autoFocus: true,
    // useBootstrap4: true,
  })],
  exports: [...modules, ContextMenuModule, ...PipesList, ...DirectivesList],
  declarations: [...PipesList, ...DirectivesList],
  providers: [],
})
export class SharedModule { }
