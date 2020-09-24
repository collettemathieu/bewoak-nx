import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Article } from '../../../shared/models/article';
import { environment } from '../../../../environments/environment';
import { switchMap, catchError } from 'rxjs/operators';
import { ErrorService } from '../error.service';
import { ApiCrossRefService } from '@bewoak-nx/api-cross-ref';

@Injectable()
export class DoiService {
  constructor(
    private errorService: ErrorService,
    private crossRefService: ApiCrossRefService
  ) {}

  /**
   * Retourne l'article à partir de son DOI.
   * @param id Identifiant DOI de l'article.
   */
  public getArticleByDoi(doi: string): Observable<Article | null> {
    this.crossRefService.setOptions({
      pid: environment.apiCrossRef.pid,
    });
    return this.crossRefService.getArticleData(doi).pipe(
      switchMap((data) => {
        return of(
          new Article({
            doi,
            title: data.title,
            authors: data.authors,
            journal: data.journal,
            year: data.year,
            abstract: data.abstract,
            url: data.url,
          })
        );
      }),
      catchError((error) => {
        return this.errorService.handleError({
          error: {
            error: {
              message: error.statusText,
            },
          },
        });
      })
    );
  }

  /**
   * Extrait le DOI de l'article à partir d'une chaîne de caractère.
   * @param doi L'identifiant de l'article.
   */
  public extractDoi(doi: string): string {
    return this.crossRefService.extractDOI(doi);
  }
}
