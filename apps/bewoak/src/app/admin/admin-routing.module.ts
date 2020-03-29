import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleAdminGuard } from '../core/guards/role-admin.guard';

const routes: Routes = [
  {
    path: 'administration',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleAdminGuard],
    canActivateChild: [AuthGuard, RoleAdminGuard],
    children: [
      {
        path: 'addUser',
        loadChildren: () => import('./add-user/add-user.module').then(m => m.AddUserModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
