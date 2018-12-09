import { NgModule } from '@angular/core';
import {
  BsDropdownModule,
  ModalModule,
  PopoverModule,
  TooltipModule
} from 'ngx-bootstrap';

export const BsModules = [
  BsDropdownModule, ModalModule, PopoverModule, TooltipModule
];


@NgModule({
  imports: [BsDropdownModule.forRoot(), ModalModule.forRoot(), PopoverModule.forRoot(), TooltipModule.forRoot()],
  exports: [BsDropdownModule, ModalModule, PopoverModule, TooltipModule],
})
export class BsModule { }
