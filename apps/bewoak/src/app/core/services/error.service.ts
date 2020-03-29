import { Injectable, ErrorHandler } from '@angular/core';
import { ToastrService } from './toastr.service';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {

  constructor(private toastrService: ToastrService) { }

  /**
   * Traite l'erreur en envoyant un message d'information à l'utilisateur
   * @param error L'erreur à afficher
   */
  public handleError(error: any): Observable<never> {
    this.toastrService.showMessage({
      type: 'danger',
      message: error.error.error.message
    });
    return throwError(error);
  }
}
