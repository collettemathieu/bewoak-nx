import { Component } from '@angular/core';
import { AddArticleModalComponent } from '../add-article/add-article-modal/add-article-modal.component';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';

@Component({
  selector: 'bw-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss']
})
export class AddArticleComponent {

  private modalRef: MDBModalRef;

  constructor(private modalService: MDBModalService) { }

  /**
   * Modal pour l'ajout d'un nouvel article
   */
  public addArticle() {
    this.modalRef = this.modalService.show(AddArticleModalComponent, { class: 'modal-lg' });
    this.modalRef.content.title = 'Ajouter un article au parcours';
  }
}
