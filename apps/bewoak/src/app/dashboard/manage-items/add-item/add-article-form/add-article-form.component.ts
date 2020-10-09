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
import { Item } from '../../../../shared/models/item';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { DoiService } from '../../../../core/services/article/doi.service';
import { ToastrService } from '../../../../core/services/toastr.service';
import { Store } from '@ngrx/store';
import {
  State,
  getCurrentCourse,
  RefreshItemsInCurrentCourse,
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
  public article: BehaviorSubject<Item | null> = new BehaviorSubject(null);
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
    private toastrService: ToastrService,
  ) {}

  ngOnInit() {
    this.formDoi = this.createDoiForm();
    this.formArticle = this.createArticleForm();
    this.subscription = this.store
      .select(getCurrentCourse)
      .subscribe(
        (currentCourse: Course) => (this.currentCourse = currentCourse),
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
      year: [
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
    const doi = this.doiService.extractDoi(this.doi.value);
    this.doiService
      .getArticleByDoi(doi)
      .pipe(
        switchMap((article: Item) =>
          this.articleService
            .getArticleByDoi(this.doiService.extractDoi(doi))
            .pipe(
              switchMap((oldArticle: Item | null) => {
                this.isNewArticle = !!!oldArticle;
                return of(this.isNewArticle ? article : oldArticle);
              }),
            ),
        ),
      )
      .subscribe((article: Item) => {
        this.article.next(article);
        this.formArticle.setValue({
          title: article.title,
          authors: article.authors.join(', '),
          journal: article.journal,
          year: article.year,
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
   * Ajout d'un nouvel article.
   */
  private addArticle(): void {
    if (!this.formDoi.valid) {
      return;
    }

    const article = this.article.value;

    const order = {};
    order[this.currentCourse.id] = this.currentCourse.items.length + 1;
    article.courseIds = [this.currentCourse.id];
    article.dateAdd = Date.now();
    article.dateUpdate = Date.now();
    article.orderByCourseId = order;
    article.abstract = this.abstract.value;
    this.cancel();

    this.articleService.add(article).subscribe((_) => {
      this.store.dispatch(
        new RefreshItemsInCurrentCourse({ course: this.currentCourse }),
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
          'You cannot add the same item several times in the same path.',
      });
      // Fermeture de la fenêtre modale.
      this.closeModalArticle.emit(true);
      return;
    }
    article.orderByCourseId[this.currentCourse.id] =
      this.currentCourse.items.length + 1;
    article.courseIds.push(this.currentCourse.id);
    article.dateUpdate = Date.now();
    article.abstract = this.abstract.value;
    this.cancel();

    this.articleService.update(article).subscribe((_) => {
      this.store.dispatch(
        new RefreshItemsInCurrentCourse({ course: this.currentCourse }),
      );
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
}
