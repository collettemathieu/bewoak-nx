import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormUserService {
  private form: FormGroup;

  constructor(private fb: FormBuilder) {}

  /**
   * Retourne le formGroup pour l'entité User en fonction des contrôles demandés.
   */
  public generateFormGroup(controls: string[]): FormGroup {
    this.form = this.fb.group({});
    controls.forEach((control) => {
      switch (control) {
        case 'firstname':
          this.addFirstNameControl();
          break;
        case 'lastname':
          this.addLastNameControl();
          break;
        case 'jobBackground':
          this.addJobBackgroundControl();
          break;
        case 'email':
          this.addEmailControl();
          break;
        case 'roleControl':
          this.addRolesControl();
          break;
      }
    });

    return this.form;
  }

  private addFirstNameControl() {
    const control = new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      updateOn: 'blur',
    });
    this.form.addControl('firstname', control);
  }

  /**
   * Définition des contrôles du FormGroup.
   */
  private addLastNameControl() {
    const control = new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      updateOn: 'blur',
    });
    this.form.addControl('lastname', control);
  }

  private addJobBackgroundControl() {
    const control = new FormControl('', {
      validators: [Validators.required, Validators.minLength(5)],
    });
    this.form.addControl('jobBackground', control);
  }

  private addEmailControl() {
    const control = new FormControl('', {
      validators: [Validators.required, Validators.email],
      updateOn: 'blur',
    });
    this.form.addControl('email', control);
  }

  private addRolesControl() {
    const control = new FormControl('', {
      validators: [Validators.required],
      updateOn: 'blur',
    });
    this.form.addControl('roleControl', control);
  }
}
