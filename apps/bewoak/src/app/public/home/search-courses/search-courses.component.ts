import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../../shared/models/course';
import { Store } from '@ngrx/store';
import { State, getSearchResults } from '../../store';

@Component({
  selector: 'bw-search-courses',
  templateUrl: './search-courses.component.html',
  styleUrls: ['./search-courses.component.scss']
})
export class SearchCoursesComponent implements OnInit {

  public courses$: Observable<Course[]>;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.courses$ = this.store.select(getSearchResults);
  }

}
