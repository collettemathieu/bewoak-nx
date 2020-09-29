import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoadCourse, getCourse } from '../../store';
import { Course } from '../../shared/models/course';
import { Observable } from 'rxjs';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { CourseDetailModalComponent } from './course-detail-modal/course-detail-modal.component';

@Component({
  selector: 'bw-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  public course$: Observable<Course>;
  public modalRef: MDBModalRef;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private modalService: MDBModalService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param: { id: string }) => {
      this.store.dispatch(new LoadCourse({ idCourse: param.id }));
    });
    this.course$ = this.store.select(getCourse);
  }

  /**
   * Ouvre la fenêtre modale pour le détail du parcours pédagogique.
   */
  detailCourse() {
    this.modalRef = this.modalService.show(CourseDetailModalComponent, {
      class: 'modal-lg',
      scroll: true,
    });
    this.modalRef.content.course$ = this.course$;
  }
}
