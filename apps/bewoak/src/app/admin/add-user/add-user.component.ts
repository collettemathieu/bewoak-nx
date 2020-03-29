import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/user/auth.service';
import { RandomService } from '../../core/services/random.service';
import { FormUserService } from '../../core/services/user/form-user.service';
import { User } from '../../shared/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'bw-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  public formIsSubmitted = false; // Après enregistrement, affiche les informations de l'utilisateur
  public user: User = new User({});
  public passwordUser: string;
  public addUserForm: FormGroup;
  public roles: Array<string> = ['USER', 'EXPERT', 'ADMIN'];
  public config = {
    // if objects array passed which key to be displayed defaults to description
    displayKey: 'description',
    // true/false for the search functionlity defaults to false
    search: true,
    // height of the list so that if there are more no of items it can show
    // a scroll defaults to auto. With auto height scroll will never appear
    height: 'auto',
    // text to be displayed when no item is selected defaults to Select
    placeholder: 'Sélectionner les roles',
    // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    moreText: 'en plus',
    // text to be displayed when no items are found while searching
    noResultsFound: 'Aucun résultat trouvé !',
    // label thats displayed in search input
    searchPlaceholder: 'Rechercher',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private randomService: RandomService,
    private formUserService: FormUserService
  ) { }

  ngOnInit() {
    this.addUserForm = this.createForm();
  }

  /**
   * Création du formulaire de l'utilisateur à partir du générateur de formulaire
   */
  private createForm(): FormGroup {
    // Contrôles demandés
    const controlsAsked = ['firstname', 'lastname', 'email', 'roleControl'];
    // Récupération du formulaire standard de l'entité User
    return this.formUserService.generateFormGroup(controlsAsked);
  }

  /**
   * Soummission du formulaire
   */
  public submitForm(): void {
    if (this.addUserForm.valid) {
      const options = {
        firstname: this.firstname.value,
        lastname: this.lastname.value,
        email: this.email.value,
        password: this.randomService.generatePassword(),
        role: this.roleControl.value
      };

      // Enregistrement de l'utilisateur dans le firebase
      // Affichage des informations utilisateur si ok
      // On reste sur le formulaire si ko
      this.authService.register(options).subscribe(
        user => {
          this.user = user;
          this.passwordUser = options.password;
          this.formIsSubmitted = true;
        }
      );
    }
  }

  /**
   * Redirection vers la page d'accueil
   */
  public goHome() {
    this.router.navigate(['home']);
  }

  get firstname() {
    return this.addUserForm.get('firstname');
  }

  get lastname() {
    return this.addUserForm.get('lastname');
  }

  get email() {
    return this.addUserForm.get('email');
  }

  get roleControl() {
    return this.addUserForm.get('roleControl');
  }

}
