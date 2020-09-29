import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesUserComponent } from './courses-user.component';
import { EditCourseComponent } from './edit-course/edit-course.component';

const routes: Routes = [
  { path: 'manageCourse', component: CoursesUserComponent },
  { path: 'editCourse/:id', component: EditCourseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesUserRoutingModule {}
