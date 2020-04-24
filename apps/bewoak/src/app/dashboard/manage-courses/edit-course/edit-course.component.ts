import { Component, OnInit, OnDestroy } from '@angular/core';
import { CourseStateService } from '../../../core/services/course/course-state.service';
import { Observable, Subscription } from 'rxjs';
import { Course } from '../../../shared/models/course';
import { AddCourseModalComponent } from '../add-course/add-course-modal/add-course-modal.component';
import { ActivatedRoute } from '@angular/router';
import { MDBModalService, MDBModalRef } from 'angular-bootstrap-md';

@Component({
  selector: 'bw-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit, OnDestroy {

  public course$: Observable<Course | null>;
  private modalRef: MDBModalRef;
  private subscription: Subscription;

  constructor(
    private courseStateService: CourseStateService,
    private modalService: MDBModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Récupération du cours en fonction de son id.
    const idCourse = this.route.snapshot.paramMap.get('id');
    this.subscription = this.courseStateService.getCourse(idCourse).subscribe();

    // On s'abonne à l'état du parcours demandé.
    this.course$ = this.courseStateService.course$;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public editCourse() {
    this.modalRef = this.modalService.show(AddCourseModalComponent, { class: 'modal-lg' });
    this.modalRef.content.title = 'Modifier le parcours pédagogique';
  }

}
