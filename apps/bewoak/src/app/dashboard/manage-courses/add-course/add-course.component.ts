import { Component } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddCourseModalComponent } from './add-course-modal/add-course-modal.component';

@Component({
  selector: 'bw-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {

  public bsModelRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  /**
   * Modal pour l'ajout d'un nouveau parcours
   */
  addCourse() {
    this.bsModelRef = this.modalService.show(AddCourseModalComponent, { class: 'modal-lg' });
    this.bsModelRef.content.title = 'Nouveau parcours pédagogique';
  }

}
