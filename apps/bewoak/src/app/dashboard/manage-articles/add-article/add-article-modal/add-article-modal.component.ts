import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'bw-add-article-modal',
  templateUrl: './add-article-modal.component.html',
  styleUrls: ['./add-article-modal.component.scss']
})
export class AddArticleModalComponent {

  public title: string;

  constructor(private bsModelRef: BsModalRef) { }

  /**
   * Fermeture de la fenêtre modale
   */
  public closeModal() {
    this.bsModelRef.hide();
  }

  /**
   * Demande de fermeture de la fenêtre modale
   * @param closed Est-ce que la fenêtre doit être fermée ?
   */
  public mustBeClosed(closed: boolean) {
    if (closed) {
      this.closeModal();
    }
  }
}
