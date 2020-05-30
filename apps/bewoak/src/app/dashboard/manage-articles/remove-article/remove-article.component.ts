import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../../shared/models/article';
import { ArticleService } from '../../../core/services/article/article.service';
import { Store } from '@ngrx/store';
import { State, getCurrentCourse, RefreshArticlesInCurrentCourse } from '../../store';
import { Course } from '../../../shared/models/course';

@Component({
  selector: 'bw-remove-article',
  templateUrl: './remove-article.component.html',
  styleUrls: ['./remove-article.component.scss']
})
export class RemoveArticleComponent implements OnInit {

  @Input()
  article: Article;

  private currentCourse: Course;

  constructor(
    private articleService: ArticleService,
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.store.select(getCurrentCourse).subscribe((currentCourse: Course) => this.currentCourse = currentCourse);
  }

  /**
   * Suppression logique du lien entre l'article et le parcours pédagogique courant.
   */
  public remove(): void {

    const courseIds = [... this.article.courseIds];
    const orderByCourseId = { ... this.article.orderByCourseId };
    const index = this.article.courseIds.findIndex((element) => {
      return element === this.currentCourse.id;
    });
    if (index === -1) {
      return;
    }
    courseIds.splice(index, 1);
    delete orderByCourseId[this.currentCourse.id];
    const article = Object.assign({}, this.article, {
      courseIds,
      orderByCourseId
    });
    this.articleService.update(article).subscribe(
      _ => {
        this.store.dispatch(new RefreshArticlesInCurrentCourse({ course: this.currentCourse }));
      }
    );
  }

}
