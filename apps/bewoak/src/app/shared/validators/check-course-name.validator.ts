import { Injectable } from '@angular/core';
import { CourseService } from '../../core/services/course/course.service';
import { AsyncValidator, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CourseStateService } from '../../core/services/course/course-state.service';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class CheckCourseNameValidator implements AsyncValidator {

  constructor(private courseService: CourseService, private courseStateService: CourseStateService) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {

    const course: Course = this.courseStateService.getCurrentCourse();

    if (course && course.name === control.value) {
      return of(null);
    }

    return this.courseService.isAvailable(control.value).pipe(
      map(isAvailable => {
        return isAvailable ? null : { checkCourseName: true };
      }),
      catchError(() => null)
    );
  }
}
