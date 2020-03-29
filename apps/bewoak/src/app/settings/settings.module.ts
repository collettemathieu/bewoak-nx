import { NgModule } from '@angular/core';

import { SettingsRoutingModule } from './settings-routing.module';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './settings.component';
import { NavbarSettingsComponent } from './navbar-settings/navbar-settings.component';
import { AccountModule } from './account/account.module';


@NgModule({
  declarations: [SettingsComponent, NavbarSettingsComponent],
  imports: [
    SharedModule,
    SettingsRoutingModule,
    ProfileModule,
    AccountModule
  ]
})
export class SettingsModule { }
