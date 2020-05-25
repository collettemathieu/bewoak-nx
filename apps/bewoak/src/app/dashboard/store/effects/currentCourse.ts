import { CourseService } from '../../../core/services/course/course.service';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { CurrentCourseActionTypes, LoadCurrentCourse, LoadCurrentCourseSuccess, UpdateCurrentCourse } from '../actions/currentCourse';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { throwError, Observable, of } from 'rxjs';
import { Course } from '../../../shared/models/course';
import { ArticleService } from '../../../core/services/article/article.service';
import { Article } from '../../../shared/models/article';


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
            (idCourse: string) => {
                return this.courseService.getCourse(idCourse);
            }
        ),
        switchMap(
            (course: Course) => {
                this.articleService.getCourseArticles(course.id).subscribe(
                    articles => {
                        this.sortByOrder(articles, course.id).forEach(article => {
                            course.articles.push(new Article(article));
                        });
                    }
                );
                return of(course);
            }
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

    /**
     * Tri les articles selon leur ordre d'apparition dans le parcours pédagogique.
     * @param articles Un tableau d'articles à trier.
     */
    private sortByOrder(articles: Article[], idCourse: string) {
        return articles.sort((a: Article, b: Article) => {
            return a.orderByCourseId[idCourse] - b.orderByCourseId[idCourse];
        });
    }
}