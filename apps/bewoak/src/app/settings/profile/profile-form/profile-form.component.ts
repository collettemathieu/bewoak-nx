import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/user/auth.service';
import { FormUserService } from '../../../core/services/user/form-user.service';
import { User } from '../../../shared/models/user';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { UpdateCurrentUserAction } from '../../../store';

@Component({
  selector: 'bw-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit, OnDestroy {

  public formProfile: FormGroup;
  public roles: string;
  private user: User;
  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store,
    private formUserService: FormUserService
  ) { }

  /**
   * Si l'utilisateur est connecté, création et insertion des données
   * utilisateur dans le formulaire de profil.
   */
  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(
      user => {
        this.user = user;
        if (user) {
          // Affichage des rôles de l'utiliateur (pour information).
          this.roles = this.getRolesFromUser(user);
          // Création du formulaire de profil.
          this.formProfile = this.createForm();
          // Insertion des données utilisateur.
          this.formProfile.setValue(this.getDataForFormProfile(user));
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Enregistrement des modifications du profil utilisateur.
   */
  public submit(): void {
    if (this.formProfile.valid) {
      const user = this.user;
      user.firstname = this.firstname.value;
      user.lastname = this.lastname.value;
      user.jobBackground = this.jobBackground.value;
      user.dateUpdate = Date.now();
      this.store.dispatch(new UpdateCurrentUserAction({user}));
    }
  }

  /**
   * Création du formulaire de profil utilisateur.
   */
  private createForm(): FormGroup {
    // Contrôles demandés.
    const controlsAsked = ['firstname', 'lastname', 'jobBackground'];
    // Récupération du formulaire standard de l'entité User.
    return this.formUserService.generateFormGroup(controlsAsked);
  }

  /**
   * Transformation des données utilisateur pour le formulaire de profil.
   * @param user utilisateur courant.
   * @return Un object JSON avec les données pour le formulaire.
   */
  private getDataForFormProfile(user: User): object {
    return {
      firstname: user.firstname,
      lastname: user.lastname,
      jobBackground: user.jobBackground
    };
  }

  /**
   * Transformation des rôles de l'objet utilisateur pour un affichage dans le formulaire.
   * @param user utilisateur courant.
   */
  private getRolesFromUser(user: User): string {
    let roles = '';
    let userRole: string;
    user.roles.forEach((role, index) => {
      switch (role) {
        case 'ROOT':
          userRole = 'Super administrateur';
          break;
        case 'ADMIN':
          userRole = 'Administrateur';
          break;
        case 'EXPERT':
          userRole = 'Expert';
          break;
        case 'USER':
          userRole = 'Utilisateur';
          break;
      }

      if (index === 0) {
        roles = `${userRole}`;
      } else {
        roles = `${roles}, ${userRole}`;
      }
    });
    return roles;
  }

  get firstname() {
    return this.formProfile.get('firstname');
  }

  get lastname() {
    return this.formProfile.get('lastname');
  }

  get jobBackground() {
    return this.formProfile.get('jobBackground');
  }

}
