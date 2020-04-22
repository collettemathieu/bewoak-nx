import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/user/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleExpertGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        const hasRole = !!user && user.hasRole('EXPERT');
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
