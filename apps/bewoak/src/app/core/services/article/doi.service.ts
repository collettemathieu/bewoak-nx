import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Article } from '../../../shared/models/article';
import { ApiCrossRefServiceService } from './api-cross-ref-service.service';
import { environment } from '../../../../environments/environment';
import { switchMap, catchError } from 'rxjs/operators';
import { ErrorService } from '../error.service';

@Injectable()
export class DoiService {

  constructor(
    private errorService: ErrorService,
    private ApiCrossRefService: ApiCrossRefServiceService
  ) { }

  /**
   * Retourne l'article à partir de son DOI.
   * @param id Identifiant DOI de l'article.
   */
  public getArticleByDoi(doi: string): Observable<Article | null> {
    this.ApiCrossRefService.setOptions({
      pid: environment.apiCrossRef.pid
    });
    return this.ApiCrossRefService.getArticleData(doi).pipe(
      switchMap(data => {
        return of(new Article({
          doi,
          title: data.title
        }));
      }),
      catchError(error => {
        return this.errorService.handleError({
          error: {
            error: {
              message: error.statusText
            }
          }
        });
      })
    );
  }

  /**
   * Extrait le DOI de l'article à partir d'une chaîne de caractère.
   * @param doi L'identifiant de l'article.
   */
  public extractDoi(doi: string): string {
    return this.ApiCrossRefService.extractDOI(doi);
  }
}
