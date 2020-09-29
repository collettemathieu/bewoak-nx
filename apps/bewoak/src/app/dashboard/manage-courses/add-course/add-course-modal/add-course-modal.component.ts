import { Component } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';

@Component({
  selector: 'bw-add-course-modal',
  templateUrl: './add-course-modal.component.html',
  styleUrls: ['./add-course-modal.component.scss'],
})
export class AddCourseModalComponent {
  public title: string;

  constructor(private modalRef: MDBModalRef) {}

  /**
   * Fermeture de la fenêtre modale.
   */
  public closeModal() {
    this.modalRef.hide();
  }

  /**
   * Demande de fermeture de la fenêtre modale.
   * @param closed Est-ce que la fenêtre doit être fermée ?
   */
  public mustBeClosed(closed: boolean) {
    if (closed) {
      this.closeModal();
    }
  }
}
