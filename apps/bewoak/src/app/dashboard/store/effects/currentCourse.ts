import { CourseService } from '../../../core/services/course/course.service';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  CurrentCourseActionTypes,
  LoadCurrentCourse,
  LoadCurrentCourseSuccess,
  UpdateCurrentCourse,
  UpdateCurrentCourseSuccess,
} from '../actions/currentCourse';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { Course } from '../../../shared/models/course';
import { Action } from '@ngrx/store';

const handleLoadedCourse = () => (source: Observable<Course>) =>
  source.pipe(
    map((course) => new LoadCurrentCourseSuccess({ course })),
    catchError((error) => {
      return throwError(error);
    }),
  );

const handleUpdatedCourse = () => (source: Observable<Course>) =>
  source.pipe(
    map((course) => new UpdateCurrentCourseSuccess({ course })),
    catchError((error) => {
      return throwError(error);
    }),
  );

@Injectable()
export class CurrentCourseEffects {
  constructor(private courseService: CourseService, private action$: Actions) {}

  @Effect()
  $load: Observable<Action> = this.action$.pipe(
    ofType(CurrentCourseActionTypes.Load),
    map((action: LoadCurrentCourse) => action.payload.idCourse),
    switchMap((idCourse: string) => this.courseService.getCourse(idCourse)),
    handleLoadedCourse(),
  );

  @Effect()
  $update = this.action$.pipe(
    ofType(CurrentCourseActionTypes.Update),
    map((action: UpdateCurrentCourse) => action.payload.course),
    switchMap((course: Course) => this.courseService.update(course)),
    handleUpdatedCourse(),
  );

  @Effect()
  $refreshItems: Observable<Action> = this.action$.pipe(
    ofType(CurrentCourseActionTypes.RefreshItems),
    map((action: UpdateCurrentCourse) => action.payload.course),
    switchMap((course: Course) =>
      this.courseService.refreshItemsInCourse(course),
    ),
    handleLoadedCourse(),
  );
}
