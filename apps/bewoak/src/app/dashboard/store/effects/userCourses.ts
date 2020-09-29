import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { CourseService } from '../../../core/services/course/course.service';
import {
  UserCoursesActionTypes,
  LoadUserCourses,
  LoadUserCoursesSuccess,
  RemoveUserCourse,
  AddUserCourse,
} from '../actions/userCourses';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { Course } from '../../../shared/models/course';
import { Observable, throwError } from 'rxjs';
import { Action } from '@ngrx/store';

const handleLoadedCourses = () => (source: Observable<Course[]>) =>
  source.pipe(
    map((userCourses) => new LoadUserCoursesSuccess({ courses: userCourses })),
    catchError((error) => {
      return throwError(error);
    }),
  );

@Injectable()
export class UserCoursesEffects {
  constructor(
    private actions$: Actions,
    private courseService: CourseService,
  ) {}

  @Effect()
  loadAllUserCourses$: Observable<Action> = this.actions$.pipe(
    ofType(UserCoursesActionTypes.Load),
    map((action: LoadUserCourses) => action.payload.userId),
    switchMap((userId: string) => this.courseService.getCoursesByUser(userId)),
    handleLoadedCourses(),
  );

  @Effect({ dispatch: false })
  $addUserCourse$ = this.actions$.pipe(
    ofType(UserCoursesActionTypes.Add),
    map((action: AddUserCourse) => action.payload.course),
    switchMap((course: Course) => this.courseService.save(course)),
    catchError((error) => {
      return throwError(error);
    }),
  );

  @Effect({ dispatch: false })
  removeUserCourse$ = this.actions$.pipe(
    ofType(UserCoursesActionTypes.Remove),
    map((action: RemoveUserCourse) => action.payload.course),
    switchMap((course: Course) => this.courseService.remove(course)),
    catchError((error) => {
      return throwError(error);
    }),
  );
}
