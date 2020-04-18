import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: BehaviorSubject<User | null> = new BehaviorSubject(null);
  private http: HttpClient;
  public readonly user$: Observable<User | null> = this.user.asObservable();

  constructor(
    private handler: HttpBackend,
    private router: Router,
    private userService: UserService,
    private toastrService: ToastrService,
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private randomService: RandomService
  ) {
    // Requête Http sans intercepteur
    this.http = new HttpClient(this.handler);
  }

  /**
   * Méthode permettant l'authentification depuis firebase de l'utilisateur
   * @param email Mail de l'utilisateur
   * @param password Mot de passe de l'utilisateur
   */
  login(email: string, password: string): Observable<User | null> {

    // Mise en attente
    this.loaderService.setLoading(true);

    // Configuration de la requête
    const requestData = {
      email,
      password,
      returnSecureToken: true
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url = `${environment.firebase.auth.baseUrl}accounts:signInWithPassword?key=${environment.firebase.apiKey}`;

    // Envoi requête
    return this.http.post<Observable<User | null>>(url, requestData, httpOptions).pipe(
      switchMap((data: any) => {
        const userId: string = data.localId;
        const jwt: string = data.idToken;
        // Sauvegarde des données dans le localStorage
        this.saveAuthData(userId, jwt);
        // Récupération des données utilisateur
        return this.userService.getUser(userId);
      }),
      tap(user => this.user.next(user)),
      tap(_ => this.logOutTimer(3600)),
      tap(_ => {
        // Envoi d'un message
        this.toastrService.showMessage({
          type: 'success',
          message: `Bienvenue ${this.user.getValue().firstname}`
        });
      }),
      catchError((error) => {
        // Fin mise en attente
        this.loaderService.setLoading(false);
        // Envoi d'un message d'erreur
        return this.errorService.handleError(error);
      }),
      finalize(() => {
        // Fin mise en attente
        this.loaderService.setLoading(false);
      })
    );
  }

  /**
   * Méthode permettant l'authentification automatique depuis firebase de l'utilisateur
   */
  automaticLogin(): void {
    const data = this.getDataFromLocalStorage();
    const userId: string = data.id || '';
    const jwt: string = data.token || '';
    const now = new Date().getTime();
    const expirationDate: number = +data.date || now;

    if (!jwt) {
      return;
    }

    if (now >= expirationDate) {
      return;
    }

    this.userService.getUser(userId).subscribe(
      user => {
        this.user.next(user);
        this.router.navigate(['home']);
      }
    );
  }

  /**
   * Méthode permettant l'enregistrement de l'utilisateur sur firebase
   * @param options Données de l'utilisateur
   */
  register(newUser: User): Observable<{ user: User, password: string } | null> {
    // Mise en attente
    this.loaderService.setLoading(true);

    // Configuration
    const url = `${environment.firebase.auth.baseUrl}accounts:signUp?key=${environment.firebase.apiKey}`;
    const requestData = {
      email: newUser.email,
      password: this.randomService.generatePassword(),
      returnSecureToken: true
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    // Envoi requête
    return this.http.post<User>(url, requestData, httpOptions).pipe(
      switchMap((data: any) => {
        newUser.id = data.localId;
        newUser.dateAdd = Date.now();
        newUser.dateUpdate = Date.now();
        this.userService.save(newUser).subscribe();
        return of({
          user: newUser,
          password: requestData.password
        });
      }),
      tap(_ => {
        // Envoi d'un message
        this.toastrService.showMessage({
          type: 'success',
          message: 'L\'utilisateur a bien été enregistré'
        });
      }),
      catchError((error) => {
        // Fin mise en attente
        this.loaderService.setLoading(false);
        // Retourne l'erreur à l'utilisateur
        return this.errorService.handleError(error);
      }),
      finalize(() => {
        // Fin mise en attente
        this.loaderService.setLoading(false);
      })
    );
  }

  /**
   * Méthode permettant d'enregistrer les modifications d'un utilisateur
   * @param currentUser Utilisateur courant
   */
  updateStateUser(currentUser: User): Observable<User | null> {
    this.loaderService.setLoading(true);

    return this.userService.update(currentUser).pipe(
      tap(user => this.user.next(user)),
      tap(_ => this.toastrService.showMessage({
        type: 'success',
        message: 'Votre profil a bien été enregistré'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  /**
   * Méthode permettant la déconnexion de l'utilisateur
   */
  logout(): void {
    this.removeDataFromLocalStorage();
    this.user.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Méthode permettant la déconnexion automatique de l'utilisateur
   * @param timer Temps avant déconnection
   */
  private logOutTimer(timer: number): void {
    of(true).pipe(
      delay(timer * 1000)
    ).subscribe(
      _ => this.logout()
    );
  }

  /**
   * Méthode permettant de sauvegarder en local storage les données utilisateurs
   * @param userId Id de l'utilisateur courant
   * @param jwt Id du token
   */
  private saveAuthData(userId: string, jwt: string): void {
    this.setDataFromLocalStorage({
      id: userId,
      token: jwt,
      date: new Date()
    });
  }


  /* Méthode permettant de récupérer l'utilisateur courant
    @return User
  */
  public getCurrentUser(): User {
    return this.user.getValue();
  }

  /* Méthode permettant de récupérer les informations du local storage
    @return {
    id: string,
    token: string,
    date date d'expiration du token
    }
  */
  public getDataFromLocalStorage(): {
    id: string,
    token: string,
    date: number
  } {
    const userId: string = localStorage.getItem('userId') || '';
    const jwt: string = localStorage.getItem('token') || '';
    const expirationDate: number = +localStorage.getItem('expirationDate') || 0;

    return {
      id: userId,
      token: jwt,
      date: expirationDate
    };
  }

  /* Méthode permettant de modifier les informations du local storage
    @param data: {
    id: string,
    token: string,
    date: Date
    }
    @return void
  */
  public setDataFromLocalStorage(data: {
    id: string,
    token: string,
    date: Date
  }): void {
    localStorage.setItem('expirationDate', (data.date.getTime() + 3600 * 1000).toString());
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.id);
  }

  /* Méthode permettant de supprimer les informations du local storage
    @return void
  */
  public removeDataFromLocalStorage(): void {
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

}
