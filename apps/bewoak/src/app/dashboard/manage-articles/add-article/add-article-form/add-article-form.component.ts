import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ArticleService } from '../../../../core/services/article/article.service';
import { Course } from '../../../../shared/models/course';
import { Article } from '../../../../shared/models/article';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DoiService } from '../../../../core/services/article/doi.service';
import { ToastrService } from '../../../../core/services/toastr.service';
import { Store } from '@ngrx/store';
import {
  State,
  getCurrentCourse,
  RefreshArticlesInCurrentCourse,
} from '../../../store';

@Component({
  selector: 'bw-add-article-form',
  templateUrl: './add-article-form.component.html',
  styleUrls: ['./add-article-form.component.scss'],
})
export class AddArticleFormComponent implements OnInit, OnDestroy {
  public formDoi: FormGroup;
  public formArticle: FormGroup;
  public article: BehaviorSubject<Article | null> = new BehaviorSubject(null);
  private currentCourse: Course;
  private subscription: Subscription;

  @Output()
  private closeModalArticle: EventEmitter<boolean> = new EventEmitter(false);

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private store: Store<State>,
    private doiService: DoiService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.formDoi = this.createDoiForm();
    this.formArticle = this.createArticleForm();
    this.subscription = this.store
      .select(getCurrentCourse)
      .subscribe(
        (currentCourse: Course) => (this.currentCourse = currentCourse)
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Création du formulaire pour la recherche d'un article à partir de son DOI.
   */
  private createDoiForm(): FormGroup {
    return this.fb.group({
      doi: [
        '',
        {
          validators: [
            Validators.required,
            Validators.pattern('(https://doi.org/){0,1}[0-9]{2}.[0-9]{4,5}/.+'),
          ],
          asyncValidators: [],
          updateOn: 'change',
        },
      ],
    });
  }

  /**
   * Création du formulaire d'ajout d'un article au parcours pédagogique.
   */
  private createArticleForm(): FormGroup {
    return this.fb.group({
      title: [
        '',
        {
          validators: [Validators.required],
          asyncValidators: [],
          updateOn: 'change',
        },
      ],
      abstract: [
        '',
        {
          validators: [Validators.required, Validators.minLength(100)],
          asyncValidators: [],
          updateOn: 'change',
        },
      ],
    });
  }

  /**
   * Prévisualisation des données de l'article sélection par son DOI.
   */
  public preview(): void {
    if (!this.formDoi.valid) {
      return;
    }
    this.doiService.getArticleByDoi(this.doi.value).subscribe((article) => {
      this.article.next(article);
      this.formArticle.setValue({
        title: article.title,
        abstract: article.abstract,
      });
    });
  }

  /**
   * Annulation de la prévisualisation de l'article.
   */
  public cancel(): void {
    this.article.next(null);
  }

  /**
   * Validation du formulaire pour l'ajout d'un article au parcours pédagogique.
   * L'article est ajouté ou mis à jour selon son statut en bdd.
   */
  public submit(): void {
    if (!this.formDoi.valid) {
      return;
    }

    if (!this.article) {
      return;
    }

    this.articleService
      .getArticleByDoi(this.doiService.extractDoi(this.doi.value))
      .subscribe((article) => {
        if (article === null) {
          this.addArticle();
        } else {
          this.updateArticle(article);
        }
      });
  }

  /**
   * Ajout de l'article en cours de validation.
   */
  private addArticle(): void {
    if (!this.formDoi.valid) {
      return;
    }

    const article = this.article.value;

    const order = {};
    order[this.currentCourse.id] = this.currentCourse.articles.length + 1;
    article.courseIds = [this.currentCourse.id];
    article.dateAdd = Date.now();
    article.dateUpdate = Date.now();
    article.orderByCourseId = order;
    article.doi = this.doiService.extractDoi(this.doi.value);
    article.abstract = this.abstract.value;

    this.articleService.add(article).subscribe((_) => {
      this.store.dispatch(
        new RefreshArticlesInCurrentCourse({ course: this.currentCourse })
      );
      this.article.next(null);
      // Fermeture de la fenêtre modale.
      this.closeModalArticle.emit(true);
    });
  }

  /**
   * Modification de l'article en cours de validation.
   */
  private updateArticle(article: Article): void {
    // Un article ne peut être associé plusieurs fois à un même parcours.
    if (article.courseIds.includes(this.currentCourse.id)) {
      this.toastrService.showMessage({
        type: 'info',
        message:
          'Vous ne pouvez pas ajouter plusieurs fois le même article dans un même parcours.',
      });
      // Fermeture de la fenêtre modale.
      this.closeModalArticle.emit(true);
      return;
    }
    article.orderByCourseId[this.currentCourse.id] =
      this.currentCourse.articles.length + 1;
    article.courseIds.push(this.currentCourse.id);
    article.dateUpdate = Date.now();
    article.doi = this.doiService.extractDoi(this.doi.value);
    article.abstract = this.abstract.value;

    this.articleService.update(article).subscribe((_) => {
      this.store.dispatch(
        new RefreshArticlesInCurrentCourse({ course: this.currentCourse })
      );
      this.article.next(null);
      // Fermeture de la fenêtre modale.
      this.closeModalArticle.emit(true);
    });
  }

  get doi() {
    return this.formDoi.get('doi');
  }

  get abstract() {
    return this.formArticle.get('abstract');
  }

  get title() {
    return this.formArticle.get('title');
  }
}
