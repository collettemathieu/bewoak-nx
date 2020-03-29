import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/user/auth.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => !!user),
      tap(isLogged => {
        if (!isLogged) {
          this.router.navigate(['login']);
          return false;
        }
        return true;
      })
    );
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }

}
