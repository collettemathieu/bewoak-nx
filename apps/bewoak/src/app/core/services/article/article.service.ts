import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Item } from '../../../shared/models/item';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { switchMap, catchError } from 'rxjs/operators';
import { ItemService } from '../item/item.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService extends ItemService {
  /**
   * Retourne l'article s'il existe à partir de son DOI.
   * @param doi Identifiant de l'article.
   */
  public getArticleByDoi(doi: string): Observable<Item | null> {
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
    return this.httpClient.post<Item>(url, req, httpOptions).pipe(
      switchMap((data: any) => {
        if (data[0].document) {
          return of(this.getItemFromFirestore(data[0].document.fields));
        }
        return of(null);
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      }),
    );
  }
}
