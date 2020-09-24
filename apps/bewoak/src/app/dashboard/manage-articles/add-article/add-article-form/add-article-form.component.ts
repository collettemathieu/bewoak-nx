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
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { DoiService } from '../../../../core/services/article/doi.service';
import { ToastrService } from '../../../../core/services/toastr.service';
import { Store } from '@ngrx/store';
import {
  State,
  getCurrentCourse,
  RefreshArticlesInCurrentCourse,
} from '../../../store';
import { switchMap } from 'rxjs/operators';

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
  private isNewArticle = true;
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
      authors: [
        '',
        {
          validators: [Validators.required],
          asyncValidators: [],
          updateOn: 'change',
        },
      ],
      journal: [
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
    const doi = this.doi.value.trim();
    this.doiService
      .getArticleByDoi(doi)
      .pipe(
        switchMap((article: Article) =>
          this.articleService
            .getArticleByDoi(this.doiService.extractDoi(doi))
            .pipe(
              switchMap((oldArticle: Article | null) => {
                this.isNewArticle = !!!oldArticle;
                return of(this.isNewArticle ? article : oldArticle);
              })
            )
        )
      )
      .subscribe((article: Article) => {
        this.article.next(article);
        this.formArticle.setValue({
          title: article.title,
          authors: article.authors.join(', '),
          journal: article.journal,
          abstract: article.abstract,
        });
      });
  }

  /**
   * Annulation de la prévisualisation de l'article.
   */
  public cancel(): void {
    this.formArticle.reset();
    this.article.next(null);
    this.isNewArticle = true;
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
    if (this.isNewArticle) {
      return this.addArticle();
    }
    this.updateArticle();
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
    this.cancel();

    this.articleService.add(article).subscribe((_) => {
      this.store.dispatch(
        new RefreshArticlesInCurrentCourse({ course: this.currentCourse })
      );
      // Fermeture de la fenêtre modale.
      this.closeModalArticle.emit(true);
    });
  }

  /**
   * Modification de l'article en cours de validation.
   */
  private updateArticle(): void {
    const article = this.article.value;

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
    this.cancel();

    this.articleService.update(article).subscribe((_) => {
      this.store.dispatch(
        new RefreshArticlesInCurrentCourse({ course: this.currentCourse })
      );
      // Fermeture de la fenêtre modale.
      this.closeModalArticle.emit(true);
    });
  }

  get doi() {
    return this.formDoi.get('doi');
  }

  get title() {
    return this.formArticle.get('title');
  }

  get authors() {
    return this.formArticle.get('authors');
  }

  get journal() {
    return this.formArticle.get('journal');
  }

  get abstract() {
    return this.formArticle.get('abstract');
  }
}
