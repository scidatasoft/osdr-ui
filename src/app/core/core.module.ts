import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// rm
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthInterceptor } from './services/auth/auth-interceptor';
import { HttpInterceptorService } from './services/Interceptor/http-interceptor.service';

import {
  BsDropdownModule,
  ModalModule,
  PopoverModule,
  TooltipModule
} from 'ngx-bootstrap';

import { ServicesList } from './services-list';
import { ContextMenuModule } from 'ngx-contextmenu';

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
