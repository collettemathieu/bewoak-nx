import { NgModule } from '@angular/core';

import { AddUserRoutingModule } from './add-user-routing.module';
import { AddUserComponent } from './add-user.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AddUserComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AddUserRoutingModule
  ]
})
export class AddUserModule { }
