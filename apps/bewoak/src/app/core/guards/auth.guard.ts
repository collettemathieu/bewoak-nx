import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/user/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    const isAuth: boolean = this.authService.isAuthenticated();
    if (!isAuth) {
      this.router.navigate(['login']);
      return of(false);
    }
    return of(true);
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}
