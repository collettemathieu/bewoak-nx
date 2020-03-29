import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleExpertGuard } from '../core/guards/role-expert.guard';
import { DashboardComponent } from './dashboard.component';
import { EditCourseComponent } from './manage-courses/edit-course/edit-course.component';
import { CoursesUserComponent } from './manage-courses/courses-user.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleExpertGuard],
    canActivateChild: [AuthGuard, RoleExpertGuard],
    children: [
      { path: 'manageCourse', component: CoursesUserComponent },
      { path: 'editCourse/:id', component: EditCourseComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
