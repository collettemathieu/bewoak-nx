import { Component, Input } from '@angular/core';
import { Article } from '../../../shared/models/article';

@Component({
  selector: 'bw-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.scss'],
})
export class ViewArticleComponent {
  @Input()
  public article: Article;
}
