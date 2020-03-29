import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../shared/models/course';
import { CoursesStateUserService } from '../../core/services/course/courses-state-user.service';
import { CourseStateService } from '../../core/services/course/course-state.service';

@Component({
  selector: 'bw-courses-user',
  templateUrl: './courses-user.component.html',
  styleUrls: ['./courses-user.component.scss']
})
export class CoursesUserComponent implements OnInit {

  public courses$: Observable<Course[]>;

  constructor(
    private courseStateUserService: CoursesStateUserService,
    private courseStateService: CourseStateService
  ) { }

  ngOnInit() {
    this.courses$ = this.courseStateUserService.coursesByUser$;
    this.courseStateService.resetCourse();
  }

  public remove(course: Course): void {
    this.courseStateUserService.removeCourse(course);
  }

}
