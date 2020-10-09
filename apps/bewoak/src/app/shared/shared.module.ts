import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CDKModule } from './modules/cdk.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MDBBootstrapModule.forRoot(),
    SelectDropDownModule,
    CDKModule,
  ],
  exports: [CommonModule, MDBBootstrapModule, SelectDropDownModule, CDKModule],
})
export class SharedModule {}
