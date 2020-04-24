import { Component, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Course } from '../../../shared/models/course';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';

@Component({
  selector: 'bw-remove-course',
  templateUrl: './remove-course.component.html',
  styleUrls: ['./remove-course.component.scss']
})
export class RemoveCourseComponent {

  @Output()
  removeCourse: EventEmitter<Course> = new EventEmitter();

  public modalRef: MDBModalRef;

  constructor(private modalService: MDBModalService) { }

  /**
   * Ouverture de la fenêtre modale de confirmation de suppression du parcours.
   * @param template Le template de la fenêtre modale.
   */
  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  /**
   * Abandon de la suppression du parcours pédagogique.
   */
  public decline(): void {
    this.modalRef.hide();
  }

  /**
   * Suppression du parcours pédagogique.
   */
  public remove(): void {
    this.modalRef.hide();
    this.removeCourse.emit();
  }

}
