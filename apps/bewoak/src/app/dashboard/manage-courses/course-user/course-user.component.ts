import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Course } from '../../../shared/models/course';
import { Router } from '@angular/router';

@Component({
  selector: 'bw-course-user',
  templateUrl: './course-user.component.html',
  styleUrls: ['./course-user.component.scss']
})
export class CourseUserComponent {

  @Input()
  course: Course;

  @Output()
  removeCourse: EventEmitter<Course> = new EventEmitter();

  constructor(
    private router: Router,
  ) { }

  /**
   * Redirection vers la page d'édition du parcours pédagogique.
   */
  public edit(): void {
    this.router.navigate(['dashboard/editCourse', this.course.id]);
  }

  /**
   * Suppression du parcours pédagogique
   */
  public remove(): void {
    this.removeCourse.emit(this.course);
  }
}
