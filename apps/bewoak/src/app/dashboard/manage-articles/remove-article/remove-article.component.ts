import { Component, Input } from '@angular/core';
import { Article } from '../../../shared/models/article';
import { ArticleService } from '../../../core/services/article/article.service';
import { CourseStateService } from '../../../core/services/course/course-state.service';

@Component({
  selector: 'bw-remove-article',
  templateUrl: './remove-article.component.html',
  styleUrls: ['./remove-article.component.scss']
})
export class RemoveArticleComponent {

  @Input()
  article: Article;

  constructor(
    private articleService: ArticleService,
    private courseStateService: CourseStateService
  ) { }

  /**
   * Suppression logique d'un article du parcours pédagogique en cours.
   */
  public remove(): void {
    const course = this.courseStateService.getCurrentCourse();
    const index = this.article.courseIds.findIndex((element) => {
      return element === course.id;
    });
    if (index !== -1) {
      this.article.courseIds.splice(index, 1);
    }
    delete this.article.orderByCourseId[course.id];

    this.articleService.update(this.article).subscribe(
      _ => {
        this.courseStateService.getCourse(course.id).subscribe();
      }
    );
  }

}
