import { Injectable } from '@angular/core';
import { Course } from '../../../shared/models/course';
import { Observable, BehaviorSubject } from 'rxjs';
import { CourseService } from './course.service';
import { ToastrService } from '../toastr.service';
import { tap, catchError, finalize } from 'rxjs/operators';
import { ErrorService } from '../error.service';
import { LoaderService } from '../loader.service';

@Injectable()
export class CoursesStateUserService {

  // Etat des parcours pédagogiques d'un utilisateur.
  private coursesByUser: BehaviorSubject<Course[]> = new BehaviorSubject([]);
  public readonly coursesByUser$: Observable<Course[]> = this.coursesByUser.asObservable();


  constructor(
    private courseService: CourseService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private errorService: ErrorService
  ) { }

  /**
   * Ajout un nouveau parcours pédagogique.
   * @param course Le parcours pédagogique.
   * @return Retourne le tableau des parcours pédagogiques de l'utilisateur mis à jour.
   */
  public register(course: Course): Observable<Course> {

    // Mise en attente.
    this.loaderService.setLoading(true);

    return this.courseService.save(course).pipe(
      tap(newCourse => {
        const courses = this.coursesByUser.value;
        courses.push(newCourse);
        this.coursesByUser.next(courses);
      }),
      tap(_ => {
        // Envoi d'un message à l'utilisateur.
        this.toastrService.showMessage({
          type: 'success',
          message: 'Le parcours pédagogique a bien été enregistré'
        });
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => {
        // Fin mise en attente.
        this.loaderService.setLoading(false);
      })
    );
  }

  /**
   * Retourne les parcours pédagogiques de l'utilisateur.
   * @param userId L'identifiant de l'utilisateur.
   */
  public getCoursesByUser(userId: string): Observable<Course[]> {

    // Mise en attente.
    this.loaderService.setLoading(true);

    return this.courseService.getCoursesByUser(userId).pipe(
      tap(courses => {
        this.coursesByUser.next(courses);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => {
        // Fin mise en attente.
        this.loaderService.setLoading(false);
      })
    );
  }

  /**
   * Suppression d'un parcours pédagogique.
   * @param course Le parcours pédagogiqe à supprimer.
   */
  public removeCourse(course: Course): void {
    // Mise en attente.
    this.loaderService.setLoading(true);

    this.courseService.remove(course).pipe(
      tap(oldCourse => {
        const courses = this.coursesByUser.value;
        const index = courses.findIndex(c => {
          return c === oldCourse;
        });
        if (index !== -1) {
          courses.splice(index, 1);
        }

        this.coursesByUser.next(courses);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => {
        // Mise en attente.
        this.loaderService.setLoading(false);
      })
    ).subscribe();
  }

}
