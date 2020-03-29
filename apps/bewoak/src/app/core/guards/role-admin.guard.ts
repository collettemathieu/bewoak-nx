import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/user/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleAdminGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService) { }

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        return !!user && user.hasRole('ADMIN');
      })
    );
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }

}
