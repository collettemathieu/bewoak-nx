import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/user/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleUserGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        const hasRole = !!user && user.hasRole('USER');
        if (!hasRole) {
          this.router.navigate(['home']);
        }
        return hasRole;
      })
    );
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}
