import { NgModule } from '@angular/core';

import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './settings.component';
import { NavbarSettingsComponent } from './navbar-settings/navbar-settings.component';


@NgModule({
  declarations: [SettingsComponent, NavbarSettingsComponent],
  imports: [
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
