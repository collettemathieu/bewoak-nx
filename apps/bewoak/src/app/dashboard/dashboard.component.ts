import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../shared/models/user';
import { AuthService } from '../core/services/user/auth.service';
import { CoursesStateUserService } from '../core/services/course/courses-state-user.service';
import { Subscription } from 'rxjs';

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
    private coursesStateUserService: CoursesStateUserService,
  ) { }

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(
      user => this.user = user
    );
    this.coursesStateUserService.getCoursesByUser(this.user.id).subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
