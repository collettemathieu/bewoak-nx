import { Component, OnInit } from '@angular/core';
import { CoursesStateSearchService } from '../../../core/services/course/courses-state-search.service';
import { Observable } from 'rxjs';
import { Course } from '../../../shared/models/course';

@Component({
  selector: 'bw-search-courses',
  templateUrl: './search-courses.component.html',
  styleUrls: ['./search-courses.component.scss']
})
export class SearchCoursesComponent implements OnInit {

  public courses$: Observable<Course[]>;

  constructor(private coursesStateSearchService: CoursesStateSearchService) { }

  ngOnInit() {
    this.courses$ = this.coursesStateSearchService.searchCourses$;
  }

}
