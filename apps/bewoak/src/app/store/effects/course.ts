import { CourseService } from '../../core/services/course/course.service';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  CourseActionTypes,
  LoadCourse,
  LoadCourseSuccess,
} from '../actions/course';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { Course } from '../../shared/models/course';
import { Action } from '@ngrx/store';

const handleLoadedCourse = () => (source: Observable<Course>) =>
  source.pipe(
    map((course) => new LoadCourseSuccess({ course })),
    catchError((error) => {
      return throwError(error);
    }),
  );

@Injectable()
export class CourseEffects {
  constructor(private courseService: CourseService, private action$: Actions) {}

  @Effect()
  $load: Observable<Action> = this.action$.pipe(
    ofType(CourseActionTypes.Load),
    map((action: LoadCourse) => action.payload.idCourse),
    switchMap((idCourse: string) => this.courseService.getCourse(idCourse)),
    handleLoadedCourse(),
  );
}
