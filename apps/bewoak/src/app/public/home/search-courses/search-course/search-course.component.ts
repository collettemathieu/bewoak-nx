import { Component, Input } from '@angular/core';
import { Course } from '../../../../shared/models/course';
import { Router } from '@angular/router';

@Component({
  selector: 'bw-search-course',
  templateUrl: './search-course.component.html',
  styleUrls: ['./search-course.component.scss']
})
export class SearchCourseComponent {
  @Input()
  public course: Course;

  constructor(private router: Router) { }

  public navigateToCourse(): void {
    this.router.navigate(['course', this.course.id]);
  }
}
