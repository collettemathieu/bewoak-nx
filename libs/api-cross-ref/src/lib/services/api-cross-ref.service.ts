import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { CrossRefInterface } from '../interfaces/cross-ref-interface';

@Injectable()
export class ApiCrossRefService {

  private static readonly STATUS_RESOLVED = 'resolved';
  private static readonly STATUS_UNRESOLVED = 'unresolved';
  private static readonly ERROR_PARSER = 'Error in scanning document';
  private options = {
    pid: '',
    format: ''
  };
  private http: HttpClient;

  constructor(
    private handler: HttpBackend
  ) {
    // Requête Http sans intercepteur
    this.http = new HttpClient(this.handler);
  }

  /**
   * Retourne les données d'un article scientifique en fonction de son identifiant DOI
   * @param pattern Chaîne de caractère possédant l'identifiant DOI de l'article scientifique
   */
  public getArticleData(pattern: string): Observable<CrossRefInterface | null> {
    if (!this.idDOIValid(pattern)) {
      return of(null);
    }

    const doi = this.extractDOI(pattern);
    const url = `${this.getBaseUrl()}pid=${this.options.pid}&format=${this.options.format}&doi=${doi}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'text/xml'
    });

    return this.http.get(url, { headers, responseType: 'text' }).pipe(
      switchMap(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const parseError = xmlDoc.getElementsByTagName('parsererror');
        if (parseError.length !== 0) {
          return throwError({
            code: 404,
            statusText: ApiCrossRefService.ERROR_PARSER
          });
        }
        const status = xmlDoc.getElementsByTagName('query')[0].getAttribute('status');
        if (status === ApiCrossRefService.STATUS_RESOLVED) {
          return of(this.getDataFromCrossRef(xmlDoc));
        }
        if (status === ApiCrossRefService.STATUS_UNRESOLVED) {
          return throwError({
            statusText: ApiCrossRefService.STATUS_UNRESOLVED
          });
        }
        return of(null);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  /**
   * Vérifie que le DOI est valide
   * @param doi L'identifiant DOI de l'article scientifique
   */
  public idDOIValid(doi: string): boolean {
    return Boolean(doi.match('(https://doi.org/){0,1}[0-9]{2}.[0-9]{4,5}/.+'));
  }

  /**
   * Extrait l'identifiant DOI d'une chaine de caractère
   * @param doi L'identifiant DOI de l'article scientifique
   */
  public extractDOI(doi: string): string {
    new RegExp('(https://doi.org/){0,1}([0-9]{2}.[0-9]{4,5}/.+)').exec(doi);
    return RegExp.$2;
  }

  /**
   * Spécifie les Options de l'API CrossRef
   * @param opts un tableau d'options
   */
  public setOptions(opts: any): void {
    this.options.pid = opts.pid ? encodeURIComponent(opts.pid) : '';
    this.options.format = opts.format ? opts.format : 'unixsd';
  }

  /**
   * Retourne les données fournies par l'API CrossRef
   * @param xmlDoc Document XML retourné par l'API CrossRef
   */
  private getDataFromCrossRef(xmlDoc: XMLDocument): CrossRefInterface {
    const authors: string[] = [];
    const listAuthors = Array.from(xmlDoc.getElementsByTagName('person_name'));
    for (const author of listAuthors) {
      const name: string = author.getElementsByTagName('given_name')[0].childNodes[0].nodeValue;
      const surname: string = author.getElementsByTagName('surname')[0].childNodes[0].nodeValue;
      authors.push(`${name} ${surname}`);
    }

    const abstract = '';
    const url = xmlDoc.getElementsByTagName('resource')[0].childNodes[0].nodeValue;

    return {
      title: xmlDoc.getElementsByTagName('title')[0].childNodes[0].nodeValue,
      journal: xmlDoc.getElementsByTagName('full_title')[0].childNodes[0].nodeValue,
      authors,
      year: +xmlDoc.getElementsByTagName('publication_date')[0].getElementsByTagName('year')[0].childNodes[0].nodeValue,
      abstract,
      url,
    };
  }

  /**
   * Retourne l'url de base de l'API CrossRef
   */
  private getBaseUrl(): string {
    return 'http://doi.crossref.org/search/doi?';
  }
}
