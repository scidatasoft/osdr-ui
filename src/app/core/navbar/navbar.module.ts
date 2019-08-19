import { NgModule } from '@angular/core';

import { NavbarComponent } from './navbar.component';
import { CommonModulesList } from 'app/common-modules-list';
import { SharedModule } from 'app/shared/shared.module';
import { ContextMenuModule } from 'ngx-contextmenu';

@NgModule({
  imports: [
    SharedModule,
    ContextMenuModule.forRoot({
      autoFocus: true
      // useBootstrap4: true,
    })
  ],
  exports: [NavbarComponent],
  declarations: [NavbarComponent],
  providers: []
})
export class NavbarModule {}
