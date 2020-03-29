import { NgModule } from '@angular/core';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SharedModule } from '../../shared/shared.module';
import { AccountFormComponent } from './account-form/account-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AccountComponent, AccountFormComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
