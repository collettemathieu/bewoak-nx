import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../../shared/models/user';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { getCurrentUser } from '../../../store';

@Component({
  selector: 'bw-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
})
export class AccountFormComponent implements OnInit, OnDestroy {
  public formAccount: FormGroup;
  public user: User;
  private subscription: Subscription;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit() {
    this.subscription = this.store
      .select(getCurrentUser)
      .subscribe((user: User) => {
        this.user = user;
        this.formAccount = this.createForm();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Création du formulaire de profil utilisateur.
   */
  private createForm(): FormGroup {
    return this.fb.group({});
  }
}
