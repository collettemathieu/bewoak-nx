import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleUserGuard } from '../core/guards/role-user.guard';
import { SettingsComponent } from './settings.component';
import { ProfileComponent } from './profile/profile.component';
import { AccountComponent } from './account/account.component';


const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard, RoleUserGuard],
    canActivateChild: [AuthGuard, RoleUserGuard],
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'account', component: AccountComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
