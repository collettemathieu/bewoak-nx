import { Component } from '@angular/core';
import { AddCourseModalComponent } from './add-course-modal/add-course-modal.component';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';

@Component({
  selector: 'bw-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss'],
})
export class AddCourseComponent {
  public modalRef: MDBModalRef;

  constructor(private modalService: MDBModalService) {}

  /**
   * Modal pour l'ajout d'un nouveau parcours.
   */
  addCourse() {
    this.modalRef = this.modalService.show(AddCourseModalComponent, {
      class: 'modal-lg',
      scroll: true,
    });
    this.modalRef.content.title = 'Nouveau parcours pédagogique';
  }
}
