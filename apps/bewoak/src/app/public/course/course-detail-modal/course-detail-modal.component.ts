import { Component } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Observable } from 'rxjs';
import { Course } from '../../../shared/models/course';

@Component({
  selector: 'bw-course-detail-modal',
  templateUrl: './course-detail-modal.component.html',
  styleUrls: ['./course-detail-modal.component.scss'],
})
export class CourseDetailModalComponent {
  public course$: Observable<Course>;

  constructor(private modalRef: MDBModalRef) {}

  /**
   * Fermeture de la fenêtre modale.
   */
  public closeModal() {
    this.modalRef.hide();
  }
}
