import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'bw-navbar-settings',
  templateUrl: './navbar-settings.component.html',
  styleUrls: ['./navbar-settings.component.scss']
})
export class NavbarSettingsComponent {

  public profilePath = 'settings/profile';
  public accountPath = 'settings/account';

  constructor(private router: Router) { }

  /**
   * Retourne si la lien demandée est le lien actif
   * @param path chemin demandé
   */
  public isActive(path: string): boolean {
    return this.router.isActive(path, true); // L'url est exact
  }

  /**
   * Redirige l'utilisateur vers le lien demandé
   * @param path chemin demandé
   */
  public navigate(path: string): void {
    this.router.navigate([path]);
  }

}
