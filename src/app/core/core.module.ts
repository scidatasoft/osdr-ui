import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// rm
import { RouterModule } from '@angular/router';
import {
  BsDropdownModule,
  ModalModule,
  PopoverModule,
  TooltipModule,
} from 'ngx-bootstrap';
import { ContextMenuModule } from 'ngx-contextmenu';

import { ServicesList } from './services-list';
import { AuthInterceptor } from './services/auth/auth-interceptor';
import { HttpInterceptorService } from './services/Interceptor/http-interceptor.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    ContextMenuModule.forRoot({
      autoFocus: true,
      // useBootstrap4: true,
    })],
  exports: [],
  declarations: [],
  providers: [...ServicesList,
              { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }],
})
export class CoreModule { }
