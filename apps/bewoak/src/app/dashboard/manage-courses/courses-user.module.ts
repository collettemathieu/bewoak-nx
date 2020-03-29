import { NgModule } from '@angular/core';
import { CoursesUserComponent } from './courses-user.component';
import { CourseUserComponent } from './course-user/course-user.component';
import { SharedModule } from '../../shared/shared.module';
import { CoursesUserRoutingModule } from './courses-user-routing.module';
import { AddCourseModule } from './add-course/add-course.module';
import { RemoveCourseComponent } from './remove-course/remove-course.component';
import { EditCourseModule } from './edit-course/edit-course.module';


@NgModule({
  declarations: [CoursesUserComponent, CourseUserComponent, RemoveCourseComponent],
  imports: [
    SharedModule,
    CoursesUserRoutingModule,
    AddCourseModule,
    EditCourseModule
  ]
})
export class CoursesUserModule { }
