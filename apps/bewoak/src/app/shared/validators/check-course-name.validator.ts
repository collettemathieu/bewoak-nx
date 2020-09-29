import { Injectable } from '@angular/core';
import { CourseService } from '../../core/services/course/course.service';
import {
  AsyncValidator,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Course } from '../models/course';
import { State } from '@ngrx/store';
import { State as CourseState } from '../../dashboard/store';

@Injectable({
  providedIn: 'root',
})
export class CheckCourseNameValidator implements AsyncValidator {
  constructor(
    private courseService: CourseService,
    private state: State<CourseState>,
  ) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const course: Course = this.state.value.dashBoardPage.currentCourse.course;

    if (course && course.name === control.value) {
      return of(null);
    }

    return this.courseService.isAvailable(control.value).pipe(
      map((isAvailable) => {
        return isAvailable ? null : { checkCourseName: true };
      }),
      catchError(() => null),
    );
  }
}
