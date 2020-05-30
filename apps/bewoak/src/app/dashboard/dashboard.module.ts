import { NgModule, LOCALE_ID } from '@angular/core';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CourseService } from '../core/services/course/course.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';
registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    StoreModule.forFeature('dashBoardPage', reducers),
    EffectsModule.forFeature(effects)
  ],
  providers: [
    CourseService,
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
})
export class DashboardModule { }
