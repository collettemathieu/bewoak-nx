import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../shared/models/course';
import { Store } from '@ngrx/store';
import {
  getUserCourses,
  State,
  RemoveUserCourse,
  ResetCurrentCourse,
} from '../store';

@Component({
  selector: 'bw-courses-user',
  templateUrl: './courses-user.component.html',
  styleUrls: ['./courses-user.component.scss'],
})
export class CoursesUserComponent implements OnInit {
  public courses$: Observable<Course[]>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.courses$ = this.store.select(getUserCourses);
    this.store.dispatch(new ResetCurrentCourse());
  }

  public remove(course: Course): void {
    this.store.dispatch(new RemoveUserCourse({ course }));
  }
}
