import { Component, OnInit } from '@angular/core';
import { User } from '../shared/models/user';
import { AuthService } from '../core/services/user/auth.service';
import { CoursesStateUserService } from '../core/services/course/courses-state-user.service';
import { CourseStateService } from '../core/services/course/course-state.service';

@Component({
  selector: 'bw-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  private user: User;

  constructor(
    private authService: AuthService,
    private coursesStateUserService: CoursesStateUserService,
  ) { }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.coursesStateUserService.getCoursesByUser(this.user.id).subscribe();
  }
}
