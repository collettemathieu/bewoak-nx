import { Article } from './article';

export class Catalog {
  articles: Article[];

  constructor(options: { articles?: Article[] }) {
    this.articles = options.articles || [];
  }
}
