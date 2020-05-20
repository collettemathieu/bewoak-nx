import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../shared/models/course';
import { CourseStateService } from '../../core/services/course/course-state.service';
import { Store } from '@ngrx/store';
import { getUserCourses, State } from '../store';
import { RemoveUserCourse } from '../store/actions/userCourses';

@Component({
  selector: 'bw-courses-user',
  templateUrl: './courses-user.component.html',
  styleUrls: ['./courses-user.component.scss']
})
export class CoursesUserComponent implements OnInit {

  public courses$: Observable<Course[]>;

  constructor(
    private store: Store<State>,
    private courseStateService: CourseStateService
  ) { }

  ngOnInit() {
    this.courses$ = this.store.select(getUserCourses);
    this.courseStateService.resetCourse();
  }

  public remove(course: Course): void {
    this.store.dispatch(new RemoveUserCourse({course}));
  }

}
