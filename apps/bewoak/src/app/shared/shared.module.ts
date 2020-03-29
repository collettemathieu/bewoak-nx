import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBootstrapModule } from './modules/ngx-bootstrap.module';
import { SelectDropDownModule } from 'ngx-select-dropdown';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxBootstrapModule,
    SelectDropDownModule
  ],
  exports: [
    CommonModule,
    NgxBootstrapModule,
    SelectDropDownModule
  ]
})
export class SharedModule { }
