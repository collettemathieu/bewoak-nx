import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleExpertGuard } from '../core/guards/role-expert.guard';
import { DashboardComponent } from './dashboard.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleExpertGuard],
    canActivateChild: [AuthGuard, RoleExpertGuard],
    loadChildren: () => import('./manage-courses/courses-user.module').then(m => m.CoursesUserModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
