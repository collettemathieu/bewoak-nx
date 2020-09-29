import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../../shared/models/user';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { switchMap, catchError, tap, finalize, delay } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { ToastrService } from '../toastr.service';
import { ErrorService } from '../error.service';
import { LoaderService } from '../loader.service';
import { Router } from '@angular/router';
import { RandomService } from '../random.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngrx/store';
import {
  LoadCurrentUserAction,
  ResetCurrentUserAction,
  ResetCourseAction,
} from '../../../store';

/**
 * Temps de connexion de l'utilisateur en ms.
 */
const connectingTime = 3600;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient;
  private helper: JwtHelperService;

  constructor(
    private handler: HttpBackend,
    private router: Router,
    private userService: UserService,
    private store: Store,
    private toastrService: ToastrService,
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private randomService: RandomService,
  ) {
    // Requête Http sans intercepteur.
    this.http = new HttpClient(this.handler);
    this.helper = new JwtHelperService();
  }

  /**
   * Méthode permettant l'authentification depuis firebase de l'utilisateur.
   * @param email Mail de l'utilisateur.
   * @param password Mot de passe de l'utilisateur.
   */
  public login(email: string, password: string): Observable<User | null> {
    // Mise en attente.
    this.loaderService.setLoading(true);

    // Configuration de la requête.
    const requestData = {
      email,
      password,
      returnSecureToken: true,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const url = `${environment.firebase.auth.baseUrl}accounts:signInWithPassword?key=${environment.firebase.apiKey}`;

    // Envoi requête.
    return this.http
      .post<Observable<User | null>>(url, requestData, httpOptions)
      .pipe(
        switchMap((data: any) => {
          const userId: string = data.localId;
          const jwt: string = data.idToken;
          // Sauvegarde des données dans le localStorage.
          this.saveAuthData(userId, jwt);
          // Récupération des données utilisateur.
          return this.userService.getUser(userId);
        }),
        tap((user) => this.store.dispatch(new LoadCurrentUserAction({ user }))),
        tap((_) => this.logOutTimer(connectingTime)),
        tap((user) => {
          // Envoi d'un message.
          this.toastrService.showMessage({
            type: 'success',
            message: `Bienvenue ${user.firstname}.`,
          });
          this.router.navigate(['home']);
        }),
        catchError((error) => {
          // Fin mise en attente.
          this.loaderService.setLoading(false);
          // Envoi d'un message d'erreur.
          return this.errorService.handleError(error);
        }),
        finalize(() => {
          // Fin mise en attente.
          this.loaderService.setLoading(false);
        }),
      );
  }

  /**
   * Méthode permettant l'authentification automatique depuis firebase de l'utilisateur.
   */
  public automaticLogin(): void {
    const data = this.getDataFromLocalStorage();
    const userId: string = data.id || '';
    const jwt: string = data.token || '';

    if (this.helper.isTokenExpired(jwt)) {
      return;
    }

    this.userService.getUser(userId).subscribe((user) => {
      this.store.dispatch(new LoadCurrentUserAction({ user }));
    });
  }

  public isAuthenticated(): boolean {
    const data = this.getDataFromLocalStorage();
    const jwt: string = data.token || '';
    // Vérifie la date d'expiration du token.
    return !this.helper.isTokenExpired(jwt);
  }

  /**
   * Méthode permettant l'enregistrement de l'utilisateur sur firebase.
   * @param options Données de l'utilisateur.
   */
  public register(
    newUser: User,
  ): Observable<{ user: User; password: string } | null> {
    // Mise en attente
    this.loaderService.setLoading(true);

    // Configuration
    const url = `${environment.firebase.auth.baseUrl}accounts:signUp?key=${environment.firebase.apiKey}`;
    const requestData = {
      email: newUser.email,
      password: this.randomService.generatePassword(),
      returnSecureToken: true,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    // Envoi requête.
    return this.http.post<User>(url, requestData, httpOptions).pipe(
      switchMap((data: any) => {
        newUser.id = data.localId;
        newUser.dateAdd = Date.now();
        newUser.dateUpdate = Date.now();
        this.userService.save(newUser).subscribe();
        return of({
          user: newUser,
          password: requestData.password,
        });
      }),
      tap((_) => {
        // Envoi d'un message.
        this.toastrService.showMessage({
          type: 'success',
          message: 'L\'utilisateur a bien été enregistré',
        });
      }),
      catchError((error) => {
        // Fin mise en attente.
        this.loaderService.setLoading(false);
        // Retourne l'erreur à l'utilisateur.
        return this.errorService.handleError(error);
      }),
      finalize(() => {
        // Fin mise en attente.
        this.loaderService.setLoading(false);
      }),
    );
  }

  /**
   * Méthode permettant la déconnexion de l'utilisateur.
   */
  public logout(): void {
    this.removeDataFromLocalStorage();
    this.store.dispatch(new ResetCurrentUserAction());
    this.store.dispatch(new ResetCourseAction());
    this.router.navigate(['/login']);
  }

  /**
   * Méthode permettant de récupérer les informations du local storage.
   */
  public getDataFromLocalStorage(): {
    id: string;
    token: string;
  } {
    const userId: string = localStorage.getItem('userId') || '';
    const jwt: string = localStorage.getItem('token') || '';

    return {
      id: userId,
      token: jwt,
    };
  }

  /**
   * Méthode permettant de modifier les informations du local storage.
   * @param data Données à mettre dans le storage du navigateur.
   */
  private setDataFromLocalStorage(data: { id: string; token: string }): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.id);
  }

  /**
   * Méthode permettant de supprimer les informations du local storage.
   */
  private removeDataFromLocalStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  /**
   * Méthode permettant la déconnexion automatique de l'utilisateur.
   * @param timer Temps avant déconnexion.
   */
  private logOutTimer(timer: number): void {
    of(true)
      .pipe(delay(timer * 1000))
      .subscribe((_) => this.logout());
  }

  /**
   * Méthode permettant de sauvegarder en local storage les données utilisateurs.
   * @param userId Id de l'utilisateur courant.
   * @param jwt Id du token.
   */
  private saveAuthData(userId: string, jwt: string): void {
    this.setDataFromLocalStorage({
      id: userId,
      token: jwt,
    });
  }
}
