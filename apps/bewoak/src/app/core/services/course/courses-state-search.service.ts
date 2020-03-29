import { Injectable } from '@angular/core';
import { Course } from '../../../shared/models/course';
import { Observable, BehaviorSubject } from 'rxjs';
import { CourseService } from './course.service';
import { tap, catchError, finalize } from 'rxjs/operators';
import { ErrorService } from '../error.service';
import { LoaderService } from '../loader.service';

@Injectable()
export class CoursesStateSearchService {

  // Etat de la recherche de parcours pédagogiques
  private searchCourses: BehaviorSubject<Course[] | null> = new BehaviorSubject(null);
  public readonly searchCourses$: Observable<Course[]> = this.searchCourses.asObservable();


  constructor(
    private courseService: CourseService,
    private loaderService: LoaderService,
    private errorService: ErrorService
  ) { }

  /**
   * Retourne les résultats de la recherche de parcours pédagogique
   * @param search L'élement de recherche
   */
  public searchCourse(search: string): Observable<Course[]> {

    // Mise en attente
    this.loaderService.setLoading(true);

    return this.courseService.getCourses(search).pipe(
      tap(courses => {
        this.searchCourses.next(courses);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => {
        // Fin mise en attente
        this.loaderService.setLoading(false);
      })
    );
  }

}
