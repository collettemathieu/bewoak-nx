import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Item } from '../../../shared/models/item';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ErrorService } from '../error.service';
import { RandomService } from '../random.service';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { ToastrService } from '../toastr.service';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private http: HttpClient;

  constructor(
    protected httpClient: HttpClient,
    protected handler: HttpBackend,
    protected errorService: ErrorService,
    protected randomService: RandomService,
    protected toastrService: ToastrService,
  ) {
    // Requête Http sans intercepteur.
    this.http = new HttpClient(this.handler);
  }

  /**
   * Retourne l'ensemble des items par ordre d'apparition d'un parcours pédagogique.
   * @param id Id du parcours pédagogique.
   */
  public getCourseItems(id: string): Observable<Item[]> {
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
    return this.http.post<Item[]>(url, req, httpOptions).pipe(
      switchMap((data: any) => {
        const items: Item[] = [];
        data.forEach((element) => {
          if (element.document && typeof element.document !== 'undefined') {
            items.push(this.getItemFromFirestore(element.document.fields));
          }
        });
        return of(items);
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      }),
    );
  }

  /**
   * Ajout d'un nouvel item.
   * @param item L'item à ajouter.
   */
  public add(item: Item): Observable<Item> {
    item.id = this.randomService.generateId();
    const url = `${environment.firestore.baseUrlDocument}items?key=${environment.firebase.apiKey}&documentId=${item.id}`;
    const dataItem = this.getDataItemForFirestore(item);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.post<Item>(url, dataItem, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getItemFromFirestore(data.fields));
      }),
      tap((_) => {
        // Envoi d'un message à l'utilisateur.
        this.toastrService.showMessage({
          type: 'success',
          message: 'The item has been added to the course.',
        });
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      }),
    );
  }

  /**
   * Modification d'un item.
   * @param item L'item à modifier.
   */
  public update(item: Item): Observable<Item | null> {
    // Configuration
    const url = `${environment.firestore.baseUrlDocument}items/${item.id}?key=${environment.firebase.apiKey}&currentDocument.exists=true`;
    const dataitem = this.getDataItemForFirestore(item);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    // Enregistrement en base.
    return this.httpClient.patch<Item>(url, dataitem, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getItemFromFirestore(data.fields));
      }),
      tap((_) => {
        // Envoi d'un message à l'utilisateur.
        this.toastrService.showMessage({
          type: 'success',
          message: 'The item has been updated.',
        });
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      }),
    );
  }

  /**
   * Retourne les données de l'item pour le firestore.
   * @param item L'item à transformer.
   */
  private getDataItemForFirestore(item: Item): object {
    return {
      fields: {
        id: { stringValue: item.id },
        doi: { stringValue: item.doi },
        title: { stringValue: item.title },
        abstract: { stringValue: item.abstract },
        url: { stringValue: item.url },
        journal: { stringValue: item.journal },
        type: { stringValue: item.type },
        year: { integerValue: item.year },
        authors: {
          arrayValue: {
            values: this.getAuthorsDataForFirestore(item),
          },
        },
        courseIds: {
          arrayValue: {
            values: this.getCourseIdsDataForFirestore(item),
          },
        },
        orderByCourseId: {
          mapValue: {
            fields: this.getOrderByCourseIdDataForFirestore(item),
          },
        },
        dateAdd: { integerValue: item.dateAdd },
        dateUpdate: { integerValue: item.dateUpdate },
      },
    };
  }

  /**
   * Retourne l'item à partir des données du firestore.
   * @param fields Champs retournés par le firestore.
   * @return Un item avec les données du firestore.
   */
  protected getItemFromFirestore(fields: any): Item {
    return new Item({
      id: fields.id.stringValue,
      doi: fields.doi.stringValue,
      title: fields.title.stringValue,
      abstract: fields.abstract.stringValue,
      url: fields.url.stringValue,
      journal: fields.journal.stringValue,
      year: fields.year.integerValue,
      type: fields.type.stringValue,
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
   * Transforme les ids des parcours de l'item pour le firestore.
   * @param item L'item courant.
   * @return Un tableau de {stringValue: id}.
   */
  private getCourseIdsDataForFirestore(item: Item): object {
    const courseIds = [];
    item.courseIds.forEach((id) => {
      courseIds.push({
        stringValue: id,
      });
    });
    return courseIds;
  }

  /**
   * Transforme les auteurs de l'item pour le firestore.
   * @param item L'item courant.
   * @return Un tableau de {stringValue: author}.
   */
  private getAuthorsDataForFirestore(item: Item): object {
    const authors = [];
    item.authors.forEach((author) => {
      authors.push({
        stringValue: author,
      });
    });
    return authors;
  }

  /**
   * Transforme les ordres de l'item par parcours pédagogique pour le firestore.
   * @param item L'item courant.
   * @return Un tableau de {stringValue: id}.
   */
  private getOrderByCourseIdDataForFirestore(item: Item): object {
    const orderBycourseId = {};
    for (const key in item.orderByCourseId) {
      if (item.orderByCourseId.hasOwnProperty(key)) {
        orderBycourseId[key] = {
          integerValue: item.orderByCourseId[key],
        };
      }
    }
    return orderBycourseId;
  }

  /**
   * Transforme les ids des parcours pédagogiques reçu depuis firestore pour l'item.
   * @param ids Ids formatés des parcours pédagogique de l'item courant.
   * @return Un tableau des ids des parcours pédagogiques de l'item.
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
   * Transforme les auteurs reçus depuis firestore pour les intégrer dans l'item.
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
   * Retourne un tableau des ordres d'apparition de l'item dans les parcours pédagogiques auxquels il est rattaché
   * à partir des données de firestore.
   * @param orders Ordre de l'item dans les parcours pédagogique formatés par firetore.
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
   * Retourne la requête pour firestore afin de récupérer les items d'un parcours
   * pédagogique en fonction du champ de recherche.
   * @param field Le champ recherché avec sa valeur.
   * @return Une requête pour firestore.
   */
  protected getStructureQuery(field: {
    fieldPath: string;
    value: string;
    op: string;
  }): object {
    return {
      structuredQuery: {
        from: [
          {
            collectionId: 'items',
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
