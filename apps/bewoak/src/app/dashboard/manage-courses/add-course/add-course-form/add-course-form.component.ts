import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../../../shared/models/course';
import { User } from '../../../../shared/models/user';
import { CheckCourseNameValidator } from '../../../../shared/validators/check-course-name.validator';
import { Subscription } from 'rxjs';
import { Store, State } from '@ngrx/store';
import {
  State as CourseState,
  AddUserCourse,
  UpdateCurrentCourse,
} from '../../../store';
import { getCurrentUser } from 'apps/bewoak/src/app/store';

@Component({
  selector: 'bw-add-course-form',
  templateUrl: './add-course-form.component.html',
  styleUrls: ['./add-course-form.component.scss'],
})
export class AddCourseFormComponent implements OnInit, OnDestroy {
  @Output()
  private closeModalParent: EventEmitter<boolean> = new EventEmitter(false);
  public formCourse: FormGroup;
  // Options des difficultés du parcours pédagogique.
  public levels: { id: number; name: string }[] = [
    {
      id: 1,
      name: 'Beginner',
    },
    {
      id: 2,
      name: 'Intermediate',
    },
    {
      id: 3,
      name: 'Expert',
    },
  ];
  // Configuration du selecteur du formulaire.
  public config = {
    displayKey: 'name',
    search: false,
    height: 'auto',
    placeholder: 'Select the level of the course',
  };
  // Utilisateur courant.
  private user: User;
  // Parcours pédagogique courant.
  private course: Course;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private checkCourseNameValidator: CheckCourseNameValidator,
    private store: Store<CourseState>,
    private state: State<CourseState>,
  ) {}

  ngOnInit() {
    this.course = this.state.value.dashBoardPage.currentCourse.course;
    this.subscriptions.add(
      this.store
        .select(getCurrentUser)
        .subscribe((user: User) => (this.user = user)),
    );
    this.formCourse = this.createForm();
    this.initForm();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Création du formulaire pour l'ajout d'un parcours pédagogique.
   */
  private createForm(): FormGroup {
    return this.fb.group({
      name: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
          asyncValidators: [this.checkCourseNameValidator],
          updateOn: 'change',
        },
      ],
      description: [
        '',
        {
          validators: [Validators.required, Validators.minLength(10)],
          updateOn: 'change',
        },
      ],
      keywords: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern('^([a-z-]+(, )?)+$'),
          ],
          updateOn: 'change',
        },
      ],
      levelControl: ['', [Validators.required]],
    });
  }

  /**
   * Initialise le formulaire avec les valeurs du parcours pédagogique s'il existe.
   */
  private initForm(): void {
    if (this.course) {
      const currentLevel = this.levels.filter(
        (level) => level.name === this.course.level,
      )[0];
      this.formCourse.setValue({
        name: this.course.name,
        description: this.course.description,
        keywords: this.getKeywordsFromArray(this.course.keywords),
        levelControl: currentLevel,
      });
    }
  }

  /**
   * Validation du formulaire pour l'ajout d'un parcours pédagogique.
   */
  public submit() {
    if (!this.formCourse.valid) {
      return;
    }

    // Fermeture de la fenêtre modale.
    this.closeModalParent.emit(true);

    // Parcours pédagogique existant.
    if (this.course) {
      const freshCourse = Object.assign(
        Object.create(Object.getPrototypeOf(this.course)),
        this.course,
        {
          name: this.name.value,
          keywords: this.getKeywordsFromString(this.keywords.value),
          description: this.description.value,
          level: this.levelControl.value.name,
          dateUpdate: Date.now(),
        },
      );
      this.store.dispatch(new UpdateCurrentCourse({ course: freshCourse }));
      return;
    }

    // Nouveau parcours pédagogique.
    const course = new Course({
      name: this.name.value,
      keywords: this.getKeywordsFromString(this.keywords.value),
      description: this.description.value,
      level: this.levelControl.value.name,
      userId: this.user.id,
      dateAdd: Date.now(),
      dateUpdate: Date.now(),
    });
    this.store.dispatch(new AddUserCourse({ course }));
  }

  /**
   * Transforme un tableau de mots clés en une chaîne de caractère.
   * Le séparateur est la virgule.
   */
  private getKeywordsFromArray(keywords: Array<string>): string {
    return keywords.join(', ');
  }

  /**
   * Transforme une chaîne de caractère de mots clés en tableau.
   * Le séparateur est la virgule. On ne conserve que les mots clés non vides.
   */
  private getKeywordsFromString(keywords: string): Array<string> {
    const result = keywords.split(', ');
    return result.filter((keyword) => keyword.length > 0);
  }

  get name() {
    return this.formCourse.get('name');
  }
  get description() {
    return this.formCourse.get('description');
  }
  get keywords() {
    return this.formCourse.get('keywords');
  }
  get levelControl() {
    return this.formCourse.get('levelControl');
  }
}
