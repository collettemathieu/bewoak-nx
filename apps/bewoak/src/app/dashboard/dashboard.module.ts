import { NgModule, LOCALE_ID } from '@angular/core';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CoursesUserModule } from './manage-courses/courses-user.module';
import { CourseService } from '../core/services/course/course.service';
import { CourseStateService } from '../core/services/course/course-state.service';
import { CoursesStateUserService } from '../core/services/course/courses-state-user.service';
registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    CoursesUserModule
  ],
  providers: [
    CourseService,
    CourseStateService,
    CoursesStateUserService,
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
})
export class DashboardModule { }
