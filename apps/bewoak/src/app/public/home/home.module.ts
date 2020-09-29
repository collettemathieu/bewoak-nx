import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchCoursesComponent } from './search-courses/search-courses.component';
import { SearchCourseComponent } from './search-courses/search-course/search-course.component';
import { CourseService } from '../../core/services/course/course.service';

@NgModule({
  declarations: [
    HomeComponent,
    SearchBarComponent,
    SearchCoursesComponent,
    SearchCourseComponent,
  ],
  imports: [SharedModule, ReactiveFormsModule],
  providers: [CourseService],
})
export class HomeModule {}
