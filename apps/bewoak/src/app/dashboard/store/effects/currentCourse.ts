import { CourseService } from '../../../core/services/course/course.service';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { CurrentCourseActionTypes, LoadCurrentCourse, LoadCurrentCourseSuccess, UpdateCurrentCourse } from '../actions/currentCourse';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { Course } from '../../../shared/models/course';
import { ArticleService } from '../../../core/services/article/article.service';


const handleLoadedCourse = () => (source: Observable<Course>) => source.pipe(
    map(course => new LoadCurrentCourseSuccess({ course })),
    catchError((error) => { return throwError(error); })
);


@Injectable()
export class CurrentCourseEffect {
    constructor(
        private courseService: CourseService,
        private articleService: ArticleService,
        private action$: Actions
    ) { }

    @Effect()
    $loadCourse = this.action$.pipe(
        ofType(CurrentCourseActionTypes.Load),
        map((action: LoadCurrentCourse) => action.payload.idCourse),
        switchMap(
            (idCourse: string) => this.courseService.getCourse(idCourse)
        ),
        handleLoadedCourse()
    );

    @Effect()
    $updateCourse = this.action$.pipe(
        ofType(CurrentCourseActionTypes.Update),
        map((action: UpdateCurrentCourse) => action.payload.course),
        switchMap(
            (course: Course) => this.courseService.update(course)
        )
    );
}