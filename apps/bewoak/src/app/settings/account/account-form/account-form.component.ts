import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../../shared/models/user';
import { AuthService } from '../../../core/services/user/auth.service';

@Component({
  selector: 'bw-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {

  public formAccount: FormGroup;

  public user: User;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.authService.user$.subscribe(
      user => this.user = user
    );
    this.formAccount = this.createForm();
  }

  /**
   * Création du formulaire de profil utilisateur.
   */
  private createForm(): FormGroup {
    return this.fb.group({});
  }

}
