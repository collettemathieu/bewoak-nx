import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/user/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LogInGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    const isAuth: boolean = this.authService.isAuthenticated();
    if (isAuth) {
      this.router.navigate(['home']);
      return of(false);
    }
    return of(true);
  }
}
