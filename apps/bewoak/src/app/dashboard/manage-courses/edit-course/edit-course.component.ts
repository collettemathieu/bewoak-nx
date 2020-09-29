import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../../shared/models/course';
import { AddCourseModalComponent } from '../add-course/add-course-modal/add-course-modal.component';
import { ActivatedRoute } from '@angular/router';
import { MDBModalService, MDBModalRef } from 'angular-bootstrap-md';
import { Store } from '@ngrx/store';
import { State, getCurrentCourse, LoadCurrentCourse } from '../../store';
import { AddArticleModalComponent } from '../../manage-articles/add-article/add-article-modal.component';

@Component({
  selector: 'bw-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss'],
})
export class EditCourseComponent implements OnInit {
  public course$: Observable<Course | null>;
  private modalRef: MDBModalRef;

  constructor(
    private store: Store<State>,
    private modalService: MDBModalService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Récupération du cours en fonction de son id.
    const idCourse = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new LoadCurrentCourse({ idCourse }));

    // On s'abonne à l'état du parcours demandé.
    this.course$ = this.store.select(getCurrentCourse);
  }

  /**
   * Edition des méta données du parcours pédagogique.
   */
  public editCourse() {
    this.modalRef = this.modalService.show(AddCourseModalComponent, {
      class: 'modal-lg',
      scroll: true,
    });
    this.modalRef.content.title = 'Modifier le parcours pédagogique';
  }

  /**
   * Modal pour l'ajout d'un nouvel article.
   */
  public addArticle() {
    this.modalRef = this.modalService.show(AddArticleModalComponent, {
      class: 'modal-lg',
      scroll: true,
    });
    this.modalRef.content.title = 'Ajouter un article au parcours';
  }
}
