import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
