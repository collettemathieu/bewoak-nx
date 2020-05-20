import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../shared/models/user';
import { AuthService } from '../core/services/user/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { LoadUserCourses, State } from './store';

@Component({
  selector: 'bw-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {

  private user: User;
  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(
      user => this.user = user
    );
    this.store.dispatch(new LoadUserCourses({userId: this.user.id}));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
