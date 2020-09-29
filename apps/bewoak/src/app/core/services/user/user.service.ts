import { Injectable } from '@angular/core';
import { User } from '../../../shared/models/user';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, finalize, tap } from 'rxjs/operators';
import { ErrorService } from '../error.service';
import { LoaderService } from '../loader.service';
import { ToastrService } from '../toastr.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private loaderService: LoaderService,
    private toastrService: ToastrService,
    private errorService: ErrorService,
  ) {}

  /**
   * Méthode pour récupérer un utilisateur depuis le firestore en fonction de son
   * identififiant après authentification.
   * @param userId Identifiant de l'utilisateur.
   * @return Une observable de User.
   */
  public getUser(userId: string): Observable<User | null> {
    const url = `${environment.firestore.baseUrlDocument}:runQuery?key=${environment.firebase.apiKey}`;
    const req = this.getStructureQuery(userId);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.post(url, req, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getUserFromFirestore(data[0].document.fields));
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      }),
    );
  }

  /**
   * Méthode pour l'enregistrement d'un nouvel utilisateur dans le firestore après authentification.
   * @param user Utilisateur courant.
   * @return Une observable de User.
   */
  public save(user: User): Observable<User | null> {
    const url = `${environment.firestore.baseUrlDocument}users?key=${environment.firebase.apiKey}&documentId=${user.id}`;
    const dataUser = this.getDataUserForFirestore(user);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.post<User>(url, dataUser, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getUserFromFirestore(data.fields));
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      }),
    );
  }

  /**
   * Méthode permettant d'enregistrer des modifications partielles d'un utilisateur.
   * @param user Utilisateur courant.
   * @return Une observable de User.
   */
  public update(user: User): Observable<User | null> {
    this.loaderService.setLoading(true);

    const url = `${environment.firestore.baseUrlDocument}users/${user.id}?key=${environment.firebase.apiKey}&currentDocument.exists=true`;
    const dataUser = this.getDataUserForFirestore(user);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    // Enregistrement en base.
    return this.httpClient.patch<User>(url, dataUser, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getUserFromFirestore(data.fields));
      }),
      tap((_) =>
        this.toastrService.showMessage({
          type: 'success',
          message: 'Votre profil a bien été enregistré',
        }),
      ),
      catchError((error) => {
        return this.errorService.handleError(error);
      }),
      finalize(() => this.loaderService.setLoading(false)),
    );
  }

  /**
   * Méthode pour la transformation des données utilisateur vers le firestore.
   * @param user Utilisateur courant.
   * @return Un JSON pour firestore.
   */
  private getDataUserForFirestore(user: User): object {
    return {
      fields: {
        id: { stringValue: user.id },
        firstname: { stringValue: user.firstname },
        lastname: { stringValue: user.lastname },
        email: { stringValue: user.email },
        roles: {
          arrayValue: {
            values: this.getRolesDataForFirestore(user),
          },
        },
        avatarUrl: { stringValue: user.avatarUrl },
        jobBackground: { stringValue: user.jobBackground },
        dateAdd: { integerValue: user.dateAdd },
        dateUpdate: { integerValue: user.dateUpdate },
      },
    };
  }

  /**
   * Méthode pour la transformation des données du firestore vers l'utilisateur.
   * @param fields Champs retournés par le firestore.
   * @return Un utilisateur avec les données de firestore.
   */
  private getUserFromFirestore(fields: any): User {
    return new User({
      id: fields.id.stringValue,
      firstname: fields.firstname.stringValue,
      lastname: fields.lastname.stringValue,
      email: fields.email.stringValue,
      roles: this.getRolesDataFromFirestore(fields.roles.arrayValue),
      avatarUrl: fields.avatarUrl.stringValue,
      jobBackground: fields.jobBackground.stringValue,
      dateAdd: fields.dateAdd.integerValue,
      dateUpdate: fields.dateUpdate.integerValue,
    });
  }

  /**
   * Méthode pour la transformation des roles de l'utilisateur vers le firestore.
   * @param user Utilisateur courant.
   * @return Un tableau de {stringValue: role}.
   */
  private getRolesDataForFirestore(user: User): object {
    const rolesUser = [];
    user.roles.forEach((role) => {
      rolesUser.push({
        stringValue: role,
      });
    });
    return rolesUser;
  }

  /**
   * Méthode pour la transformation des roles du firestore vers l'utilisateur.
   * @param roles Roles de l'utilisateur courant.
   * @return Un tableau des rôles de l'utilisateur.
   */
  private getRolesDataFromFirestore(
    roles: any,
  ): Array<'USER' | 'EXPERT' | 'ADMIN'> {
    const rolesUser = [];
    roles.values.forEach((value) => {
      rolesUser.push(value.stringValue);
    });
    return rolesUser;
  }

  /**
   * Méthode pour le requêtage en base depuis firestore.
   * @param userId Identifiant utilisateur.
   * @return Une requête pour firestore.
   */
  private getStructureQuery(userId: string): object {
    return {
      structuredQuery: {
        from: [
          {
            collectionId: 'users',
          },
        ],
        where: {
          fieldFilter: {
            field: {
              fieldPath: 'id',
            },
            op: 'EQUAL',
            value: {
              stringValue: userId,
            },
          },
        },
      },
    };
  }
}
