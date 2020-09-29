import { Injectable } from '@angular/core';
import { CourseService } from '../../../core/services/course/course.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  SearchActionTypes,
  SearchAction,
  SearchSuccessAction,
} from '../actions/search';
import { Observable, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Course } from '../../../shared/models/course';

const handleLoadedCourses = () => (source: Observable<Course[]>) =>
  source.pipe(
    map((courses) => new SearchSuccessAction({ searchResults: courses })),
    catchError((error) => {
      return throwError(error);
    }),
  );

@Injectable()
export class SearchEffects {
  constructor(
    private readonly action$: Actions,
    private readonly courseService: CourseService,
  ) {}

  @Effect()
  loadCourses$: Observable<Action> = this.action$.pipe(
    ofType(SearchActionTypes.Search),
    map((action: SearchAction) => action.payload.searchQuery),
    switchMap((searchQuery) => this.courseService.getCourses(searchQuery)),
    handleLoadedCourses(),
  );
}
