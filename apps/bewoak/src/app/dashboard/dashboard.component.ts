import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../shared/models/user';
import { Store } from '@ngrx/store';
import { LoadUserCourses, State } from './store';
import { getCurrentUser } from '../store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bw-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.subscription = this.store.select(getCurrentUser).subscribe(
      (user: User) => this.store.dispatch(new LoadUserCourses({ userId: user.id }))
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
