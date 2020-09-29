import { Injectable } from '@angular/core';
import * as generator from 'generate-password-browser';

@Injectable({
  providedIn: 'root',
})
export class RandomService {
  constructor() {}

  /**
   * Génération d'un mot de passe aléatoire.
   */
  generatePassword(): string {
    return generator.generate({
      length: 10,
      numbers: true,
    });
  }

  /**
   * Génération d'un id aléatoire.
   */
  generateId(): string {
    return generator.generate({
      length: 20,
      numbers: true,
      uppercase: true,
    });
  }
}
