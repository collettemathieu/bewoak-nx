import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/user/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'bw-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {


  public user: User;
  public homePath = 'home';
  public dashboardPath = 'dashboard';
  public loginPath = 'login';
  public adminPath = 'administration';
  public addUserPath = '/administration/addUser';
  public manageCoursePath = '/dashboard/manageCourse';
  public settingsPath = 'settings';
  public settingsProfilePath = 'settings/profile';
  private subscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(
      user => this.user = user
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Initialise les classes de la barre de navigation en fonction de la route.
   * Supprime le box shadow pour le /home.
   */
  public getClassNav(): string {
    let classBarNav = 'navbar navbar-expand-lg navbar-dark stylish-color';
    return this.isActive(this.homePath) ? classBarNav += ' z-depth-0' : classBarNav;
  }

  /**
   * Retourne si la page demandée est la page active.
   * @param page page demandée.
   */
  public isActive(page: string): boolean {
    return this.router.isActive(page, false); // false, la route n'est pas exacte.
  }

  /**
   * Redirige l'utilisateur vers la page demandée.
   * @param page page demandée.
   */
  public navigate(page: string): void {
    this.router.navigate([page]);
  }

  /**
   * Déconnecte l'utilisateur.
   */
  public logOut(): void {
    this.authService.logout();
  }

}
