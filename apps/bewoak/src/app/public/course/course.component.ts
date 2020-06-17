import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoadCourse, getCourse } from '../../store';
import { Course } from '../../shared/models/course';
import { Observable } from 'rxjs';

@Component({
  selector: 'bw-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  public course$: Observable<Course>;

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit(): void {
    this.route.params.subscribe((param: { id: string }) => {
      this.store.dispatch(new LoadCourse({ idCourse: param.id }));
    });
    this.course$ = this.store.select(getCourse);
  }

}
