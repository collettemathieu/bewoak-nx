import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MDBBootstrapModule.forRoot(),
    SelectDropDownModule
  ],
  exports: [
    CommonModule,
    MDBBootstrapModule,
    SelectDropDownModule
  ]
})
export class SharedModule { }
