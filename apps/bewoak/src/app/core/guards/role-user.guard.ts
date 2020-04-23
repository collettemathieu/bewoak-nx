import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/user/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleUserGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(): Observable<boolean> {
    if(!this.authService.isAuthenticated()){
      return of(false);
    }
    const currentUser = this.authService.getCurrentUser();
    const hasRole = !!currentUser && currentUser.hasRole('USER');
    if (!hasRole) {
      this.router.navigate(['home']);
    }
    return of(hasRole);
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}
