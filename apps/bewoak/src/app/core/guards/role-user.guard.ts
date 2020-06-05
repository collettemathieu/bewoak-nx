import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/user/auth.service';
import { Store } from '@ngrx/store';
import { getCurrentUser } from '../../store';
import { switchMap } from 'rxjs/operators';
import { User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class RoleUserGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private store: Store,
    private authService: AuthService
  ) { }

  canActivate(): Observable<boolean> {
    if (!this.authService.isAuthenticated()) {
      return of(false);
    }
    return this.store.select(getCurrentUser).pipe(
      switchMap((user: User) => {
        const hasRole = !!user && user.hasRole('USER');
        if (!hasRole) {
          this.router.navigate(['home']);
        }
        return of(hasRole);
      })
    );
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}
