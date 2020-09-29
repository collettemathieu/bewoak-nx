import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Article } from '../../../shared/models/article';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ErrorService } from '../error.service';
import { RandomService } from '../random.service';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private http: HttpClient;

  constructor(
    private httpClient: HttpClient,
    private handler: HttpBackend,
    private errorService: ErrorService,
    private randomService: RandomService,
  ) {
    // Requête Http sans intercepteur.
    this.http = new HttpClient(this.handler);
  }

  /**
   * Retourne l'article s'il existe à partir de son DOI.
   * @param doi Identifiant de l'article.
   */
  public getArticleByDoi(doi: string): Observable<Article | null> {
    const url = `${environment.firestore.baseUrlDocument}:runQuery?key=${environment.firebase.apiKey}`;
    const req = this.getStructureQuery({
      fieldPath: 'doi',
      value: doi,
      op: 'EQUAL',
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.post<Article>(url, req, httpOptions).pipe(
      switchMap((data: any) => {
        if (data[0].document) {
          return of(this.getArticleFromFirestore(data[0].document.fields));
        }
        return of(null);
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      }),
    );
  }

  /**
   * Retourne l'ensemble des articles par ordre d'apparition d'un parcours pédagogique.
   * @param id Id du parcours pédagogique.
   */
  public getCourseArticles(id: string): Observable<Article[]> {
    const url = `${environment.firestore.baseUrlDocument}:runQuery?key=${environment.firebase.apiKey}`;
    const req = this.getStructureQuery({
      fieldPath: 'courseIds',
      value: id,
      op: 'ARRAY_CONTAINS',
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<Article[]>(url, req, httpOptions).pipe(
      switchMap((data: any) => {
        const articles: Array<Article> = [];
        data.forEach((element) => {
          if (element.document && typeof element.document !== 'undefined') {
            articles.push(
              this.getArticleFromFirestore(element.document.fields),
            );
          }
        });
        return of(articles);
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      }),
    );
  }

  /**
   * Ajout d'un nouvel article.
   * @param article L'article à ajouter.
   */
  public add(article: Article): Observable<Article> {
    article.id = this.randomService.generateId();
    const url = `${environment.firestore.baseUrlDocument}articles?key=${environment.firebase.apiKey}&documentId=${article.id}`;
    const dataArticle = this.getDataArticleForFirestore(article);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.post<Article>(url, dataArticle, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getArticleFromFirestore(data.fields));
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      }),
    );
  }

  /**
   * Modification d'un article.
   * @param article L'article à modifier.
   */
  public update(article: Article): Observable<Article | null> {
    // Configuration
    const url = `${environment.firestore.baseUrlDocument}articles/${article.id}?key=${environment.firebase.apiKey}&currentDocument.exists=true`;
    const dataArticle = this.getDataArticleForFirestore(article);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    // Enregistrement en base.
    return this.httpClient.patch<Article>(url, dataArticle, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getArticleFromFirestore(data.fields));
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      }),
    );
  }

  /**
   * Retourne les données de l'article pour le firestore.
   * @param article L'article à transformer.
   */
  private getDataArticleForFirestore(article: Article): object {
    return {
      fields: {
        id: { stringValue: article.id },
        doi: { stringValue: article.doi },
        title: { stringValue: article.title },
        abstract: { stringValue: article.abstract },
        url: { stringValue: article.url },
        journal: { stringValue: article.journal },
        year: { integerValue: article.year },
        authors: {
          arrayValue: {
            values: this.getAuthorsDataForFirestore(article),
          },
        },
        courseIds: {
          arrayValue: {
            values: this.getCourseIdsDataForFirestore(article),
          },
        },
        orderByCourseId: {
          mapValue: {
            fields: this.getOrderByCourseIdDataForFirestore(article),
          },
        },
        dateAdd: { integerValue: article.dateAdd },
        dateUpdate: { integerValue: article.dateUpdate },
      },
    };
  }

  /**
   * Méthode pour la transformation des données du firestore vers l'article.
   * @param fields Champs retournés par le firestore.
   * @return Un article avec les données du firestore.
   */
  private getArticleFromFirestore(fields: any): Article {
    return new Article({
      id: fields.id.stringValue,
      doi: fields.doi.stringValue,
      title: fields.title.stringValue,
      abstract: fields.abstract.stringValue,
      url: fields.url.stringValue,
      journal: fields.journal.stringValue,
      year: fields.year.integerValue,
      authors: this.getAuthorsDataFromFirestore(fields.authors),
      courseIds: this.getCourseIdsDataFromFirestore(fields.courseIds),
      orderByCourseId: this.getOrderByCourseIdDataFromFirestore(
        fields.orderByCourseId,
      ),
      dateAdd: fields.dateAdd.integerValue,
      dateUpdate: fields.dateUpdate.integerValue,
    });
  }

  /**
   * Méthode pour la transformation des ids des parcours de l'article vers le firestore.
   * @param article L'article courant.
   * @return Un tableau de {stringValue: id}.
   */
  private getCourseIdsDataForFirestore(article: Article): object {
    const courseIds = [];
    article.courseIds.forEach((id) => {
      courseIds.push({
        stringValue: id,
      });
    });
    return courseIds;
  }

  /**
   * Méthode pour la transformation des auteurs de l'article vers le firestore.
   * @param article L'article courant.
   * @return Un tableau de {stringValue: author}.
   */
  private getAuthorsDataForFirestore(article: Article): object {
    const authors = [];
    article.authors.forEach((author) => {
      authors.push({
        stringValue: author,
      });
    });
    return authors;
  }

  /**
   * Méthode pour la transformation des ordres de l'article par parcours pédagogique vers le firestore.
   * @param article L'article courant.
   * @return Un tableau de {stringValue: id}.
   */
  private getOrderByCourseIdDataForFirestore(article: Article): object {
    const orderBycourseId = {};
    for (const key in article.orderByCourseId) {
      if (article.orderByCourseId.hasOwnProperty(key)) {
        orderBycourseId[key] = {
          integerValue: article.orderByCourseId[key],
        };
      }
    }
    return orderBycourseId;
  }

  /**
   * Méthode pour la transformation des ids des parcours pédagogiques rendu par firestore vers l'article.
   * @param ids Ids formatés des parcours pédagogique de l'article courant.
   * @return Un tableau des ids des parcours pédagogiques de l'article.
   */
  private getCourseIdsDataFromFirestore(ids: any): string[] {
    const courseIds = [];
    if (!ids.arrayValue.values) {
      return courseIds;
    }
    ids.arrayValue.values.forEach((value) => {
      courseIds.push(value.stringValue);
    });
    return courseIds;
  }

  /**
   * Méthode pour la transformation des auteurs reçu par firestore.
   * @param listAuthors Liste des auteurs retournés par firestore.
   * @return Un tableau des auteurs avec leur nom et prénom.
   */
  private getAuthorsDataFromFirestore(listAuthors: any): string[] {
    const authors = [];
    if (!listAuthors.arrayValue.values) {
      return authors;
    }
    listAuthors.arrayValue.values.forEach((value) => {
      authors.push(value.stringValue);
    });
    return authors;
  }

  /**
   * Méthode pour la transformation des ordres par parcours pédagogique de l'article depuis le firestore vers l'article.
   * @param orders Ordre de l'article dans les parcours pédagogique formatés.
   * @return Un tableau des ordres de l'article par parcours pédagogique.
   */
  private getOrderByCourseIdDataFromFirestore(
    orders: any,
  ): { [key: string]: number } {
    const orderBycourseId = {};
    for (const key in orders.mapValue.fields) {
      if (orders.mapValue.fields.hasOwnProperty(key)) {
        orderBycourseId[key] = +orders.mapValue.fields[key].integerValue;
      }
    }
    return orderBycourseId;
  }

  /**
   * Méthode pour le requêtage en base depuis firestore afin de récupérer les articles d'un parcours pédagogique.
   * @param field Le champ recherché avec sa valeur.
   * @return Une requête pour firestore.
   */
  private getStructureQuery(field: {
    fieldPath: string;
    value: string;
    op: string;
  }): object {
    return {
      structuredQuery: {
        from: [
          {
            collectionId: 'articles',
          },
        ],
        where: {
          fieldFilter: {
            field: {
              fieldPath: field.fieldPath,
            },
            op: field.op,
            value: {
              stringValue: field.value,
            },
          },
        },
      },
    };
  }
}
